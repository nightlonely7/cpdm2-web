<template>
    <div>
        <div v-if="loading" class="text-xs-center">
            <v-progress-circular indeterminate color="primary" size="64" width="8"></v-progress-circular>
        </div>
        <template v-if="loaded">
            <table rules="rows" style="font-size: 16px; width: 85%; margin: auto">
                <tr>
                    <td style="width: 25%"><b>Tiêu đề</b></td>
                    <td style="width: 75%"><b>{{document.title}}</b></td>
                </tr>
                <tr>
                    <td>Mã hiệu</td>
                    <td>{{document.code}}</td>
                </tr>
                <tr>
                    <td>Nơi ban hành</td>
                    <td>{{document.outsider.name}} - {{document.outsider.code}}</td>
                </tr>
                <tr>
                    <td>Trích yếu</td>
                    <td>{{document.summary}}</td>
                </tr>
                <tr>
                    <td>Thông tư / Nghị định</td>
                    <td>{{document.decree}}</td>
                </tr>
                <tr>
                    <td>Ngày văn bản đến</td>
                    <td>{{moment(document.arrivalDate).format('DD/MM/YYYY')}}</td>
                </tr>
                <tr>
                    <td>Ngày văn bản có hiệu lực</td>
                    <td>{{moment(document.effectiveDate).format('DD/MM/YYYY')}}</td>
                </tr>
                <tr>
                    <td>Ngày văn bản hết hiệu lực</td>
                    <td>{{moment(document.effectiveEndDate).format('DD/MM/YYYY')}}</td>
                </tr>
                <tr>
                    <td>Thời gian tạo</td>
                    <td>{{moment(document.createdTime).format('HH:mm:ss DD/MM/YYYY')}}</td>
                </tr>
                <tr v-if="isAdmin">
                    <td>Quá trình xử lý</td>
                    <td>
                        <DocumentProcessTracking :document="{...document}"></DocumentProcessTracking>
                    </td>
                </tr>
                <tr>
                    <td>Thời gian chỉnh sửa gần nhất</td>
                    <td>{{moment(document.lastModifiedTime).format('HH:mm:ss DD/MM/YYYY')}}</td>
                </tr>

            </table>

            <br>
            <br>

            <v-card>
                <v-toolbar dark dense flat color="primary">
                    <v-toolbar-title>Nội dung chi tiết văn bản</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="document-detail" v-html="document.detail"></v-card-text>

            </v-card>

            <br>
            <br>

            <template v-if="!document.startedProcessing && isAdmin">
                <DocumentPutIntoProcessForm :id="id" @refresh="getDocumentDetail">
                    <template #activator="{on}">
                        <v-btn v-on="on" color="primary">
                            <v-icon left>build</v-icon>
                            Đưa văn bản vào quy trình xử lý
                        </v-btn>
                    </template>
                </DocumentPutIntoProcessForm>
            </template>

            <template v-if="document.currentStep && (document.currentStep.executor.username === username)">
                <DocumentExecutingForm :document="{...document}" @refresh="getDocumentDetail">
                    <template #activator="{on}">
                        <v-btn v-on="on" color="primary">
                            <v-icon left>build</v-icon>
                            Xử lý văn bản
                        </v-btn>
                    </template>
                </DocumentExecutingForm>
            </template>
            <br>
            <br>
            <DocumentFile :document="document"></DocumentFile>
            <br>
            <br>
            <DocumentFeedback :document="document" v-if="isAdmin"></DocumentFeedback>
        </template>

    </div>
</template>

<script>
    import Axios from 'axios'
    import DocumentPutIntoProcessForm from "@/components/documents/DocumentPutIntoProcessForm";
    import {mapGetters} from "vuex";
    import DocumentExecutingForm from "@/components/documents/DocumentExecutingForm";
    import DocumentProcessTracking from "@/components/documents/DocumentProcessTracking";
    import DocumentFile from "./DocumentFile";
    import DocumentFeedback from "./DocumentFeedback";

    export default {
        name: "DocumentDetail",
        components: {
            DocumentFeedback,
            DocumentFile, DocumentProcessTracking, DocumentExecutingForm, DocumentPutIntoProcessForm},
        props: {
            id: Number,
        },
        data() {
            return {
                loading: false,
                loaded: false,
                document: null,
            }
        },
        computed: {
            ...mapGetters('AUTHENTICATION_STORE', {
                username: 'username',
                isAdmin: 'isAdmin'
            })
        },
        methods: {
            getDocumentDetail() {
                this.loading = true;
                this.loaded = false;
                setTimeout(() => {
                    Axios.get(`http://localhost:8080/documents/${this.id}`)
                        .then(response => {
                            this.document = response.data;
                            this.loaded = true;
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response);
                            } else {
                                console.log(error)
                            }
                        })
                        .finally(() => {
                            this.loading = false;
                        })
                }, 1000);
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.getDocumentDetail();
            });
        }
    }
</script>

<style scoped>
    td {
        padding: 15px;
    }
    .document-detail >>> .table td{
        border: 1px solid black;
        border-collapse: collapse;
        padding: 5px;
    }
    .document-detail >>> .table th{
        border: 1px solid black;
        border-collapse: collapse;
        padding: 5px;
    }
    .document-detail >>> .table table{
        border: 1px solid black;
        border-collapse: collapse;
        margin: auto;
    }
</style>