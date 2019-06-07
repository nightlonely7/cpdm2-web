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
                        ref="txtName"
                        v-model="process.name"
                        label="Tên quy trình"
                        :rules="[rules.required,rules.length(50)]"
                >
                </v-text-field>
                <v-textarea
                        ref="txtDescription"
                        class="mb-5"
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
            <v-stepper v-model="el" vertical v-if="steps.length>0">
                <template v-for="step in steps ">
                    <v-stepper-step :complete="el > step.temporaryId" :step="step.temporaryId" editable @click="goToStep(step.temporaryId)">
                        <v-text-field
                                v-model="step.name"
                                :rules="[rules.required,rules.length(50)]"
                        ></v-text-field>
                    </v-stepper-step>

                    <v-stepper-content :step="step.temporaryId">
                        <v-select
                                v-model="step.departmentId"
                                :items="departments"
                                item-text="name"
                                item-value="id"
                                box
                                label="Chọn phòng ban"
                                @input="setExecutor"
                        ></v-select>
                        <v-select
                                v-if="selectedDepartmentId !== null && selectedDepartmentId !== 0"
                                v-model="step.executorId"
                                :items="tmpExecutors"
                                item-text="displayName"
                                item-value="id"
                                box
                                label="Chọn nhân viên phụ trách"
                        ></v-select>
                        <v-textarea class="mb-5"
                                    label="Mô tả"
                                    v-model="step.description"
                                    counter="255"
                                    :rules="[rules.required, rules.length(255)]"
                        ></v-textarea>
                        <v-btn color="success" v-if="step.temporaryId < steps.length"
                               @click="nextStep(step.temporaryId)"
                        >
                            <v-icon>navigate_next</v-icon>
                            Bước tiếp theo
                        </v-btn>
                        <OutcomeForm :step="step" :tmpSteps="tmpSteps">
                            <template #activator="{on}">
                                <v-btn v-on="on" color="primary" @click="setDialog(step.temporaryId)"
                                       v-if="step.temporaryId > 1">
                                    <v-icon left>add</v-icon>
                                    Thêm bước vòng
                                </v-btn>
                            </template>
                        </OutcomeForm>
                        <template v-for="outcome in step.outcomes">
                            <v-btn color="error"
                                   @click="goToStep(outcome.nextStepTemporaryId)"
                                   v-if="!outcome.main"
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
    import Axios from 'axios';
    import OutcomeForm from "./OutcomeForm";

    export default {
        name: "ProcessCreating",
        components: {OutcomeForm},
        data() {
            return {
                snackbar: false,
                snackbarText: null,
                valid: false,
                dialog: false,
                loading: false,
                departments: [],
                executors: [],
                tmpExecutors: [],
                el: 0,
                numberOfSteps: 0,
                process: {
                    name: null,
                    description: null,
                    firstStepTemporaryId: 1,
                    steps: []
                },
                defaultProcess: {
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
                    outcomes: [],
                    departmentId: 0,
                },
                defaultStep: {
                    name: "",
                    temporaryId: 0,
                    description: null,
                    executorId: 0,
                    outcomes: [],
                    departmentId: 0,
                },
                newOutcome: {
                    name: "",
                    description: "",
                    nextStepTemporaryId: 0,
                    lastStep: false,
                    main: false,
                },
                defaultOutcome: {
                    name: "",
                    description: "",
                    nextStepTemporaryId: 0,
                    lastStep: false,
                    main: false,
                },
                steps: [],
                tmpSteps: [],
                tmpStep: null,
                rules: {
                    length: len => v => (v || '').length <= len || `Nội dung tối đa ${len} kí tự`,
                    required: v => !!v || 'Nội dung không được để trống'
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.getDepartment();
                this.getExecutor();
            });
        },
        methods: {
            refresh(){
                this.steps = [];
                Object.assign(this.process, this.defaultProcess);
                this.numberOfSteps = 0;
                this.$refs.txtName.reset();
                this.$refs.txtDescription.reset();
            },
            getDepartment() {
                this.loading = true;
                Axios.get(`http://localhost:8080/departments/search/all`)
                    .then(response => {
                        this.departments = response.data;
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            },
            getExecutor() {
                this.loading = true;
                Axios.get(`http://localhost:8080/users/search/executor`)
                    .then(response => {
                        this.executors = response.data;
                        var archivistIndex = [];
                        var removeCount = 0;
                        for(var i in this.executors){
                            if(this.executors[i].role.name === "ROLE_DOCUMENT_WRITER"){
                                archivistIndex.push(i);
                            }
                        }
                        for(var j in archivistIndex){
                            this.$delete(this.executors,archivistIndex[j]-removeCount);
                            removeCount++;
                        }
                        for(var i in this.executors){
                            this.$set(this.executors[i], 'displayName', `${this.executors[i].username + " - " + this.executors[i].processRole}`);
                        }
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            },
            setExecutor(val){
                this.tmpExecutors = [];
                for(var i in this.executors){
                    if(this.executors[i].department.id === val){
                        this.tmpExecutors.push(Object.assign({},this.executors[i]));
                    }
                }
            },
            nextStep(temporaryId) {
                this.setExecutor(this.steps[temporaryId].departmentId);
                if (temporaryId >= this.steps.length) {
                    this.el = 1;
                } else {
                    this.el = temporaryId + 1;
                }
            },
            goToStep(nextStepTemporaryId) {
                this.setExecutor(this.steps[nextStepTemporaryId-1].departmentId);
                this.el = nextStepTemporaryId;
            },
            onInput(val) {
                var diff = val - this.steps.length;
                if (diff > 0) {
                    for (var i = 0; i < diff; i++) {
                        this.newStep.name = `Bước ${this.steps.length + 1}`;
                        this.newStep.temporaryId = this.steps.length + 1;
                        this.newStep.outcomes = [];
                        this.steps.push(Object.assign({}, this.newStep));
                    }
                    Object.assign(this.newStep, this.defaultStep);
                } else if (diff < 0) {
                    diff = 0 - diff;
                    for (var i = 0; i < diff; i++) {
                        this.steps.pop();
                    }
                }
                this.el = 1;
            },
            close(){
                this.dialog = false;
            },
            save() {
                if(this.newOutcome.name.trim() === ""){
                    return;
                }
                if(this.newOutcome.description.trim() === ""){
                    return;
                }
                if(this.newOutcome.nextStepTemporaryId === 0){
                    return;
                }

                this.tmpStep.outcomes.push(Object.assign({}, this.newOutcome));
                Object.assign(this.newOutcome, this.defaultOutcome);
                this.dialog = false;
            },
            setDialog(temporaryId) {
                this.tmpSteps = [];
                for (var i = 0; i < temporaryId - 1; i++) {
                    this.tmpSteps.push(this.steps[i]);
                }
                this.tmpStep = this.steps[temporaryId - 1];
            },
            finish() {
                this.loading = true;
                //Add default outcome for each step
                for (var i = 0; i < (this.steps.length - 1); i++) {
                    this.newOutcome.name = `Chuyển tới bước tiếp theo`;
                    this.newOutcome.description = `Chuyển tới bước tiếp theo`;
                    this.newOutcome.nextStepTemporaryId = this.steps[i + 1].temporaryId;
                    this.newOutcome.lastStep = false;
                    this.newOutcome.main = true;
                    this.steps[i].outcomes.push(Object.assign({}, this.newOutcome));
                    Object.assign(this.newOutcome, this.defaultOutcome);
                }
                console.log(this.steps[this.steps.length - 1].outcomes.length);
                this.newOutcome.name = `Chuyển tới bước tiếp theo`;
                this.newOutcome.description = `Chuyển tới bước tiếp theo`;
                this.newOutcome.nextStepTemporaryId = null;
                this.newOutcome.lastStep = true;
                this.newOutcome.main = true;
                this.steps[this.steps.length - 1].outcomes.push(Object.assign({}, this.newOutcome));
                Object.assign(this.newOutcome, this.defaultOutcome);
                //Add steps to process
                this.process.steps = this.steps;
                console.log(this.process);
                Axios.post(`http://localhost:8080/document_processes`, this.process).then(response => {
                    console.log('success');
                    this.refresh();
                    this.snackbarText = "Thành công";
                    this.snackbar = true;
                }).catch(error => {
                    console.log(error);
                    this.snackbarText = "Thất bại";
                    this.snackbar = true;
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    }
</script>

<style scoped>

</style>