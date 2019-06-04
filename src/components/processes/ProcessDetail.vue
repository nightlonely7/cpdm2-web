<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>timeline</v-icon>
                CHI TIẾT QUY TRÌNH
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer/>
            <v-btn color="primary" to="/processes">
                <v-icon dark>arrow_back</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card class="mb-3">
            <v-card-text>
                <v-text-field
                        v-model="process.name"
                        label="Tên quy trình"
                        readonly
                >
                </v-text-field>
                <v-textarea
                        class="mb-5"
                        label="Mô tả"
                        v-model="process.description"
                        readonly
                ></v-textarea>
            </v-card-text>
            <v-stepper v-model="el" vertical v-if="steps.length>0">
                <template v-for="step in steps ">
                    <v-stepper-step :complete="el > step.id" :step="step.id" editable>
                        <v-text-field
                                v-model="step.name"
                                readonly
                        ></v-text-field>
                    </v-stepper-step>

                    <v-stepper-content :step="step.id">
                        <v-select
                                v-model="step.executorId"
                                :items="executors"
                                item-text="username"
                                item-value="id"
                                box
                                label="Chọn nhân viên phụ trách"
                        ></v-select>
                        <v-textarea class="mb-5"
                                    label="Mô tả"
                                    v-model="step.description"
                                    readonly
                        ></v-textarea>
                        <v-btn color="success"
                               @click="(step.id)"
                        >
                            <v-icon>navigate_next</v-icon>
                            Bước tiếp theo
                        </v-btn>
                        <v-dialog v-model="dialog" persistent transition="dialog-bottom-transition" lazy
                                  max-width="600">
                            <template #activator="{on}">
                                <slot name="activator" :on="on"></slot>
                                <v-btn v-on="on" color="primary" @click="setDialog(step.id)"
                                       v-if="step.id > 1">
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
                                                            v-model="newOutcome.nextStepId"
                                                            :items="tmpSteps"
                                                            item-text="name"
                                                            item-value="id"
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
                                   @click="goToStep(outcome.nextStepId)"
                            >
                                <v-icon>navigate_next</v-icon>
                                {{outcome.name}}
                            </v-btn>
                        </template>
                    </v-stepper-content>
                </template>
            </v-stepper>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="finish">LƯU</v-btn>
            </v-card-actions>
        </v-card>

        <!--Snack bar-->
        <v-snackbar v-model="snackbar" right>
            {{snackbarText}}
            <v-btn
                    color="pink"
                    flat
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    export default {
        name: "ProcessDetail",
        props:{
            id: Number,
        },
        mounted() {
            this.$nextTick(() => {
                this.getProcessDetail();
            })
        },
        methods: {
            getProcessDetail(){

            }
        }
    }
</script>

<style scoped>

</style>