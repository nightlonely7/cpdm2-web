<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>timeline</v-icon>
                CHI TIẾT QUY TRÌNH
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer/>
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
                        <v-text-field
                                    v-model="step.executor.username + ' - ' + step.executor.processRole"
                                    label="Người phụ trách"
                                    readonly>
                        </v-text-field>
                        <v-textarea class="mb-5"
                                    label="Mô tả"
                                    v-model="step.description"
                                    readonly
                        ></v-textarea>
                        <v-btn color="success"
                               @click="nextStep(step.id)"
                        >
                            <v-icon>navigate_next</v-icon>
                            Bước tiếp theo
                        </v-btn>
                        <template v-for="outcome in step.outcomes">
                            <v-btn color="error"
                                   @click="goToStep(outcome.nextStep.id)"
                                   v-if="!outcome.main"
                            >
                                <v-icon>navigate_next</v-icon>
                                {{outcome.name}}
                            </v-btn>
                        </template>
                    </v-stepper-content>
                </template>
            </v-stepper>
        </v-card>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: "ProcessDetail",
        props: {
            id: Number,
        },
        data() {
            return {
                loading: false,
                el: 0,
                process: {
                    name: null,
                    description: null,
                    firstStepTemporaryId: 1,
                    steps: []
                },
                steps: [],
                maps: [],
                newMap: {
                    position: null,
                    id: null,
                },
                defaultMap: {
                    position: null,
                    id: null,
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.getProcessDetail();
            })
        },
        methods: {
            getProcessDetail() {
                this.loading = true;
                Axios.get(`http://localhost:8080/document_processes/${this.id}`)
                    .then(response => {
                        this.process = response.data;
                        Object.assign(this.steps, this.process.steps);
                        for (var i = 1; i <= this.steps.length; i++) {
                            this.newMap.position = i;
                            this.newMap.id = this.steps[i-1].id;
                            this.maps.push(Object.assign({}, this.newMap));
                        }
                        Object.assign(this.newMap, this.defaultMap);
                        for (var i = 1; i <= this.steps.length; i++) {
                            this.steps[i-1].id = i;
                            this.steps[i-1].outcomes.pop();
                            var outcomes = this.steps[i-1].outcomes;
                            for (var j in outcomes) {
                                console.log(outcomes[j]);
                                if (outcomes[j].lastStep !== true) {
                                    this.maps.forEach(value => {
                                        if (outcomes[j].nextStep.id === value.id) {
                                            outcomes[j].nextStep.id = value.position;
                                        }
                                    });
                                }
                            }
                        }
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            },
            nextStep(temporaryId) {
                if (temporaryId >= this.steps.length) {
                    this.el = 1;
                } else {
                    this.el = temporaryId + 1;
                }
            },
            goToStep(nextStepTemporaryId) {
                this.el = nextStepTemporaryId;
            },
        }
    }
</script>

<style scoped>

</style>