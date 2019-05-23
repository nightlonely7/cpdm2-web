<template>
    <div>
        <div v-if="!document.currentStep">
            <span class="success--text" v-if="document.processed"><b>Văn bản đã được xử lý</b></span>
            <span class="error--text" v-if="!document.startedProcessing && !document.processed">
                <b>Văn bản chưa được đưa vào quy trình</b></span>
        </div>
        <div style="position: relative; height: 50px" v-if="loaded">
            <template v-for="(step, index) in process.steps">

                <v-tooltip bottom v-if="step.id !== document.currentStep.id && index < currentIndex">
                    <template #activator="{ on }">
                        <v-icon color="green" v-on="on"
                                :style="`font-size: 50px; position: absolute; left: ${100 * index}px`"
                        >mdi-circle-outline
                        </v-icon>
                        <v-icon color="green" v-on="on"
                                :style="`font-size: 30px; position: absolute; top: 10px; left: ${(100 * index) + 10}px;`"
                        >mdi-check
                        </v-icon>
                    </template>
                    <span>{{step.name}}</span>
                </v-tooltip>

                <v-tooltip bottom v-if="step.id === document.currentStep.id">
                    <template #activator="{ on }">
                        <v-progress-circular color="primary" v-on="on"
                                             :style="`position: absolute; left: ${100 * index}px`"
                                             size="50" indeterminate
                        >
                        </v-progress-circular>
                        <v-icon color="primary" v-on="on"
                                :style="`font-size: 30px; position: absolute; top: 10px; left: ${(100 * index) + 10}px;`"
                        >mdi-file-document
                        </v-icon>
                    </template>
                    <span>{{step.name}}</span>
                </v-tooltip>

                <v-tooltip bottom v-if="step.id !== document.currentStep.id && index > currentIndex">
                    <template #activator="{ on }">
                        <v-icon color="secondary" v-on="on"
                                :style="`font-size: 50px; position: absolute; left: ${100 * index}px`"
                        >
                            mdi-circle-outline
                        </v-icon>
                        <v-icon color="secondary" v-on="on"
                                :style="`font-size: 30px; position: absolute; top: 10px; left: ${(100 * index) + 10}px;`"
                        >mdi-dots-horizontal
                        </v-icon>
                    </template>
                    <span>{{step.name}}</span>
                </v-tooltip>

                <v-icon color="primary" v-if="index !== process.steps.length - 1"
                        :style="`font-size: 35px; position: absolute; top: 8px; left: ${(100 * index) + 60}px`"
                >mdi-arrow-right-bold
                </v-icon>

            </template>


        </div>
    </div>
</template>

<script>
    export default {
        name: "DocumentProcessTracking",
        props: {
            document: Object,
        },
        data() {
            return {
                loaded: false,
                currentIndex: null,
                process: {
                    steps: [],
                },
            }
        },
        computed: {},
        methods: {
            getProcess() {

                const process = {
                    firstStep: {
                        id: 1,
                        name: 'Bước xử lý 1',
                    },
                    steps: [
                        {
                            id: 1, name: 'Bước xử lý 1', outcomes: [{
                                nextStep: {
                                    id: 2
                                },
                                lastStep: false,
                                main: true,
                            }]
                        },
                        {
                            id: 2, name: 'Bước xử lý 2', outcomes: [{
                                nextStep: {
                                    id: 3
                                },
                                lastStep: false,
                                main: true,
                            }]
                        },
                        {
                            id: 3, name: 'Bước xử lý 3', outcomes: [{
                                nextStep: {
                                    id: 1
                                },
                                lastStep: false,
                                main: false,
                            }, {
                                lastStep: true,
                                main: true,
                            }]
                        },
                    ]
                };
                this.process.steps.push(process.firstStep);

                for (const step of process.steps) {
                    if (this.document.currentStep.id === step.id) {
                        this.currentIndex = this.process.steps.length - 1;
                    }
                    for (const outcome of step.outcomes) {
                        if (outcome.main && !outcome.lastStep) {
                            const nextMainStep = process.steps.find(el => el.id === outcome.nextStep.id);
                            this.process.steps.push(nextMainStep);
                        }
                    }
                }
                this.loaded = true;
                console.log(this.process.steps)
            }
        },
        mounted() {
            this.$nextTick(() => {
                if (this.document.currentStep) {
                    this.getProcess();
                }
            });
        }
    }
</script>

<style scoped>

</style>