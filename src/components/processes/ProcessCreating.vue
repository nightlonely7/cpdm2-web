<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>timeline</v-icon>
                TẠO MỚI QUY TRÌNH
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
        </v-toolbar>
        <v-card class="mb-3">
            <v-card-text>
                <v-text-field
                        v-model="process.code"
                        label="Mã quy trình"
                        :rules="[rules.required,rules.length(50)]"
                >
                </v-text-field>
                <v-text-field
                        v-model="process.name"
                        label="Tên quy trình"
                        :rules="[rules.required,rules.length(50)]"
                >
                </v-text-field>
                <v-textarea class="mb-5"
                            label="Mô tả"
                            v-model="process.description"
                            counter="255"
                            :rules="[rules.required, rules.length(255)]"
                ></v-textarea>
                <v-text-field
                        v-model="numberOfSteps"
                        hint="Nhập số bước quy trình cần"
                        label="Số bước quy trình"
                        min="1"
                        persistent-hint
                        type="number"
                        @input="onInput"
                ></v-text-field>
            </v-card-text>
        </v-card>
        <v-stepper v-model="el" vertical v-if="steps.length>0">
            <template v-for="step in steps ">
                <v-stepper-step :complete="el > step.temporaryId" :step="step.temporaryId" editable>
                    <v-text-field
                            v-model="step.name"
                            :rules="[rules.required,rules.length(50)]"
                    ></v-text-field>
                </v-stepper-step>

                <v-stepper-content :step="step.temporaryId">
                    <v-select
                            ref="department"
                            :items="departments"
                            item-text="name"
                            item-value="temporaryId"
                            box
                            label="Chọn phòng ban"
                    ></v-select>
                    <v-select
                            ref="executor"
                            :items="executors"
                            item-text="name"
                            item-value="executor"
                            box
                            label="Chọn nhân viên phụ "
                    ></v-select>
                    <v-textarea class="mb-5"
                                label="Mô tả"
                                v-model="step.description"
                                counter="255"
                                :rules="[rules.required, rules.length(255)]"
                    ></v-textarea>
                    <v-btn color="success"
                           @click="nextStep(step.temporaryId)"
                    >
                        <v-icon>navigate_next</v-icon>
                        Bước tiếp theo
                    </v-btn>
                    <v-dialog v-model="dialog" persistent transition="dialog-bottom-transition" lazy max-width="600">
                        <template #activator="{on}">
                            <slot name="activator" :on="on"></slot>
                            <v-btn v-on="on" color="primary" @click="setDialog(step.temporaryId)"
                                   v-if="step.temporaryId > 1">
                                <v-icon left>add</v-icon>
                                Thêm bước vòng
                            </v-btn>
                        </template>
                        <v-card>
                            <v-toolbar dark color="primary">
                                <v-btn icon @click="dialog = false">
                                    <v-icon>close</v-icon>
                                </v-btn>
                                <v-toolbar-title>Thêm bước vòng</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-container>
                                    <v-form ref="form"
                                            v-model="valid"
                                            lazy-validation
                                    >
                                        <v-layout wrap>
                                            <v-flex xs12>
                                                <v-text-field
                                                        label="Tên bước vòng"
                                                        v-model="newOutcome.name"
                                                        :rules="[rules.required,rules.length(50)]"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-textarea class="mb-5"
                                                            label="Mô tả"
                                                            v-model="newOutcome.description"
                                                            counter="255"
                                                            :rules="[rules.required, rules.length(255)]"
                                                ></v-textarea>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-select
                                                        v-model="newOutcome.nextStepTemporaryId"
                                                        :items="tmpSteps"
                                                        item-text="name"
                                                        item-value="temporaryId"
                                                        box
                                                        label="Chọn bước"
                                                ></v-select>
                                            </v-flex>
                                        </v-layout>
                                    </v-form>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="dialog = false">Đóng</v-btn>
                                <v-btn color="blue darken-1" flat @click="save(step)">Lưu</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <template v-for="outcome in step.outcomes">
                        <v-btn color="error"
                               @click="goToStep(outcome.nextStepTemporaryId)"
                        >
                            <v-icon>navigate_next</v-icon>
                            {{outcome.name}}
                        </v-btn>
                    </template>
                </v-stepper-content>
            </template>
        </v-stepper>
    </div>
</template>

<script>
    export default {
        name: "ProcessCreating",
        data() {
            return {
                valid: false,
                dialog: false,
                loading: false,
                el: 0,
                numberOfSteps: 0,
                process: {
                    code: null,
                    name: null,
                    description: null,
                    firstStepTemporaryId: 1,
                    steps: []
                },
                newStep: {
                    name: "",
                    temporaryId: 0,
                    description: null,
                    executorId: 0,
                    outcomes: []
                },
                defaultStep: {
                    name: "",
                    temporaryId: 0,
                    description: null,
                    executorId: 0,
                    outcomes: []
                },
                newOutcome: {
                    name: "",
                    description: "",
                    nextStepTemporaryId: 0,
                    lastStep: false,
                },
                defaultOutcome: {
                    name: "",
                    description: "",
                    nextStepTemporaryId: 0,
                    lastStep: false,
                },
                steps: [],
                tmpSteps: [],
                rules: {
                    length: len => v => (v || '').length <= len || `Nội dung tối đa ${len} kí tự`,
                    required: v => !!v || 'Nội dung không được để trống'
                }
            }
        },
        methods: {
            nextStep(temporaryId) {
                console.log(temporaryId);
                if (temporaryId >= this.steps.length) {
                    this.el = 1;
                } else {
                    this.el = temporaryId + 1;
                }
            },
            goToStep(nextStepTemporaryId) {
                this.el = nextStepTemporaryId;
            },
            onInput(val) {
                var diff = val - this.steps.length;
                if (diff > 0) {
                    for (var i = 0; i < diff; i++) {
                        this.newStep.name = `Bước ${this.steps.length + 1}`;
                        this.newStep.temporaryId = this.steps.length + 1;
                        var copy = Object.assign({}, this.newStep);
                        this.steps.push(copy);
                        Object.assign(this.newStep, this.defaultStep);
                    }
                } else if (diff < 0) {
                    diff = 0 - diff;
                    for (var i = 0; i < diff; i++) {
                        this.steps.pop();
                    }
                }
                this.el = 1;
            },
            save(step) {
                // if(this.$refs.form.validate()){
                var copy = Object.assign({}, this.newOutcome);
                step.outcomes.push(copy);
                Object.assign(this.newOutcome, this.defaultOutcome);
                console.log(step.outcomes);
                this.dialog = false;
                // }
            },
            setDialog(temporaryId) {
                // this.$refs.form.reset();
                Object.assign(this.tmpSteps, []);
                for (var i = 0; i < temporaryId - 1; i++) {
                    this.tmpSteps.push(this.steps[i]);
                }
            },
        }
    }
</script>

<style scoped>

</style>