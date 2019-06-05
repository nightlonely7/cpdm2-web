<template>
    <v-dialog v-model="dialog" persistent width="500px">
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <template v-if="loaded">

            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Đưa văn bản vào quy trình xử lý</v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-container>
                        <v-layout wrap>

                            <v-flex xs12>
                                <v-select v-model="processId"
                                          :items="documentProcessed"
                                          item-value="id"
                                          item-text="name"
                                          label="Chọn quy trình xử lý">
                                </v-select>
                            </v-flex>

                        </v-layout>
                    </v-container>
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
        </template>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';
    import {pushNotif} from "../../firebase";

    export default {
        name: "DocumentPutIntoProcessForm",
        props: {
            id: Number,
        },
        data() {
            return {
                dialog: false,
                loaded: false,
                loading: false,
                documentProcessed: [],
                processId: 0,
            }
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                this.loading = true;
                Axios.patch(`http://localhost:8080/documents/${this.id}/put_into_process`, null, {
                    params: {
                        processId: this.processId
                    }
                })
                    .then((response) => {
                            this.close();
                            this.$emit('refresh');
                            var document = response.data;
                            var user = document.currentStep.executor;
                            var title = "Văn bản cần xử lý";
                            var detail = document.title;
                            var url = `/documents/${document.id}`;
                            pushNotif(title, detail, url, user);
                        }
                    )
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response)
                        } else {
                            console.log(error)
                        }
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            getDocumentProcesses() {

                Axios.get(`http://localhost:8080/document_processes`)
                    .then(response => {
                        this.documentProcessed = response.data.content;
                        this.loaded = true;
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response)
                        } else {
                            console.log(error)
                        }
                    })
                    .finally(() => {
                    })
            }
        },
        watch: {
            dialog(val) {
                if (val && !this.loaded) {
                    this.getDocumentProcesses();
                }
            },
        }
    }
</script>

<style scoped>

</style>