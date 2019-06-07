<template>
    <v-expansion-panel v-model="feedbackPanel">
        <v-expansion-panel-content>

            <template #header>
                <span><v-icon left>mdi-reply</v-icon>Danh sách phản hồi</span>
            </template>

            <v-toolbar flat dense>
                <v-toolbar-items>
                    <v-divider vertical inset></v-divider>
                    <v-btn flat color="primary" @click="getFeedback">
                        <v-icon left>cached</v-icon>
                        <span>Tải lại</span>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <div class="text-xs-center" v-if="feedbackLoading">
                <br>
                <v-progress-circular indeterminate
                                     size="64"
                                     width="8"
                                     color="primary"
                ></v-progress-circular>
                <br>
            </div>

            <div class="text-xs-center" v-if="!feedbackLoading && !feedbacks.length">
                <br>
                <span>Không có phản hồi nào</span>
            </div>

            <v-container v-if="feedbackLoaded">
                <template v-for="(feedback, index) in feedbacks">
                    <div :key="feedback.id">
                        <br v-if="index !== 0">
                        <v-card>
                            <v-card-text>
                                <p>
                                    <span style="width: 25%; float: left">Bước xử lý</span>
                                    <span style="width: 75%; float: left"><b>{{feedback.outcome.step.name}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Kết quả xử lý</span>
                                    <span style="width: 75%; float: left"><b>{{feedback.outcome.name}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Người xử lý</span>
                                    <span style="width: 75%; float: left"><b>{{feedback.outcome.step.executor.username}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Nội dung phản hồi</span>
                                    <span style="width: 75%; float: left"> {{feedback.feedback}}</span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Thời điểm bắt đầu xử lý</span>
                                    <span style="width: 25%; float: left">
                                        {{moment(feedback.arrivalTime).format('HH:mm:ss DD/MM/YYYY')}}
                                </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Thời điểm hoàn tất xử lý</span>
                                    <span style="width: 25%; float: left">
                                        {{moment(feedback.completedTime).format('HH:mm:ss DD/MM/YYYY')}}
                                </span>
                                </p>

                                <br>
                                <v-divider></v-divider>

                            </v-card-text>
                        </v-card>
                    </div>
                </template>
            </v-container>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
    import Axios from 'axios'

    export default {
        name: "DocumentFeedback",
        data() {
            return {
                feedbackPanel: null,
                feedbacks: [],
                feedbackLoaded: false,
                feedbackLoading: false,
            }
        },
        props: {
            document: Object,
        },
        methods: {
            getFeedback() {
                this.feedbackLoading = true;
                Axios.get(`http://localhost:8080/documents/${this.document.id}/feedback`)
                    .then(response => {
                        this.feedbacks = response.data;
                        this.feedbackLoaded = true;
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        } else {
                            console.log(error)
                        }
                    })
                    .finally(() => {
                        this.feedbackLoading = false;
                    })
            }
        },
        watch: {
            feedbackPanel(val) {
                if (val === 0) {
                    if (!this.feedbackLoaded) {
                        this.getFeedback();
                    }
                }
            },
        },
    }
</script>

<style scoped>

</style>