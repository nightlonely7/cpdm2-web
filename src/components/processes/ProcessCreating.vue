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
                        :value="numberOfSteps"
                        hint="Nhập số bước quy trình cần"
                        label="Số bước quy trình"
                        min="1"
                        persistent-hint
                        type="number"
                        @input="onInput"
                ></v-text-field>
            </v-card-text>
        </v-card>
        <v-stepper v-model="el" vertical>
            <template v-for="step in steps " v-if="steps.length>0">
                <v-stepper-step :complete="el > step.position" :step="step.position">
                    {{step.Name}}
                </v-stepper-step>

                <v-stepper-content :step="step.position">
                    <v-textarea class="mb-5"
                                label="Mô tả"
                                v-model="step.description"
                                counter="255"
                                :rules="[rules.required, rules.length(255)]"
                    ></v-textarea>
                    <v-btn color="success"
                           @click="nextStep(step.position)"
                            v-if="step.position < steps.length"
                    >
                        <v-icon>navigate_next</v-icon>
                        Bước tiếp theo
                    </v-btn>
                    <v-dialog v-model="dialog" persistent fullscreen transition="dialog-bottom-transition">
                        <template #activator="{on}">
                            <slot name="activator" :on="on"></slot>
                        </template>
                        <v-card>
                            <v-toolbar dark color="primary">
                                <v-btn icon @click="dialog = false">
                                    <v-icon>close</v-icon>
                                </v-btn>
                                <v-toolbar-title>Thêm bước vòng</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-container></v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-layout row justify-space-around>
                                    <v-flex md2 xs6>
                                        <v-btn color="secondary" @click="close" block>
                                            <v-icon left>clear</v-icon>
                                            Hủy
                                        </v-btn>
                                    </v-flex>
                                    <v-flex md2 xs6>
                                        <v-btn color="primary" @click="save" block :loading="loading">
                                            <v-icon left>done</v-icon>
                                            Lưu
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-btn color="primary">
                        <v-icon>mdi-plus</v-icon>
                        Thêm bước vòng
                    </v-btn>
                </v-stepper-content>
            </template>
        </v-stepper>
    </div>
</template>

<script>
    export default {
        name: "ProcessCreating",
        data () {
            return {
                dialog: false,
                el: 0,
                numberOfSteps: 0,
                newStep: {
                    name: "",
                    position: 0,
                    description: "",
                },
                defaultStep: {
                    name: "",
                    position: 0,
                    description: "",
                },
                steps : [
                    {
                        name: "Buoc 1",
                        position: 1,
                        description: "Mo ta buoc 1",
                    },
                    {
                        name: "Buoc 2",
                        position: 2,
                        description: "Mo ta buoc 2",
                    },
                    {
                        name: "Buoc 3",
                        position: 3,
                        description: "Mo ta buoc 3",
                    },
                ],
                rules: {
                    length: len => v => (v || '').length <= len || `Nội dung tối đa ${len} kí tự`,
                    required: v => !!v || 'Nội dung không được để trống'
                }
            }
        },
        methods: {
            nextStep(position){
                this.el = position+1;
            },
            onInput(val){
                console.log(val);
                console.log(this.steps.length);
                var diff = val - this.steps.length;
                console.log(diff);
                if(diff > 0){
                    for (var i = 0;i < diff; i++){
                        this.newStep.name = `Buoc ${this.steps.length + 1}`;
                        this.newStep.position = this.steps.length + 1;
                        this.steps.push(this.newStep);
                        Object.assign(this.newStep,this.defaultStep);
                    }
                    console.log(this.steps);
                } else if (diff < 0){
                    diff = 0 - diff;
                    for(var i = 0; i < diff; i++){
                        this.steps.pop();
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>