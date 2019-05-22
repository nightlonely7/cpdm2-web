<template>
    <div>
        <div v-if="loading" class="text-xs-center">
            <v-progress-circular indeterminate color="primary" size="64" width="8"></v-progress-circular>
        </div>
        <template v-if="loaded">
            <table rules="rows" width="100%" style="font-size: 16px;">
                <tr>
                    <td style="width: 20%"><b>Tiêu đề</b></td>
                    <td style="width: 80%"><b>{{document.title}}</b></td>
                </tr>
                <tr>
                    <td style="width: 20%">Trích yếu</td>
                    <td style="width: 80%">{{document.summary}}</td>
                </tr>
            </table>

            <template v-if="!document.startedProcessing">
                <PutDocumentIntoProcessForm :id="id" @refresh="getDocumentDetail">
                    <template #activator="{on}">
                        <v-btn v-on="on" color="primary">
                            <v-icon left>build</v-icon>
                            Đưa văn bản vào quy trình xử lý
                        </v-btn>
                    </template>
                </PutDocumentIntoProcessForm>
            </template>
        </template>

    </div>
</template>

<script>
    import Axios from 'axios'
    import PutDocumentIntoProcessForm from "@/components/documents/PutDocumentIntoProcessForm";

    export default {
        name: "DocumentDetail",
        components: {PutDocumentIntoProcessForm},
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
    td{
        padding: 5px;
    }
</style>