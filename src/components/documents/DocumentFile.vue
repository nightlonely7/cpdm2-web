<template>
    <v-expansion-panel v-model="documentFilePanel">
        <v-expansion-panel-content>

            <template #header>
                <span><v-icon left>mdi-paperclip</v-icon>Danh sách tệp tin</span>
            </template>

            <v-toolbar flat dense>
                <v-toolbar-items>
                    <v-divider vertical inset></v-divider>
                    <v-btn flat color="primary" @click="getDocumentFiles">
                        <v-icon left>cached</v-icon>
                        <span>Tải lại</span>
                    </v-btn>
                    <v-divider vertical inset></v-divider>
                    <DocumentFileForm :document="{...document}" @refresh="getDocumentFiles" creating>
                        <template #activator="{ on }">
                            <v-btn v-on="on" flat color="primary">
                                <v-icon left>add</v-icon>
                                <span>Thêm tệp tin</span>
                            </v-btn>
                        </template>
                    </DocumentFileForm>
                    <v-divider vertical inset></v-divider>
                </v-toolbar-items>
            </v-toolbar>
            <div class="text-xs-center" v-if="documentFileLoading">
                <br>
                <v-progress-circular indeterminate
                                     size="64"
                                     width="8"
                                     color="primary"
                ></v-progress-circular>
                <br>
            </div>

            <div class="text-xs-center" v-if="!documentFileLoading && !documentFiles.length">
                <br>
                <span>Không có tệp tin nào</span>
            </div>

            <v-container v-if="documentFiles.length">
                <template v-for="(documentFile, index) in documentFiles">
                    <div :key="documentFile.id" v-if="!isArchivist || (isArchivist && username === documentFile.creator.username)">
                        <br v-if="index !== 0">
                        <v-card>
                            <v-card-text>
                                <p>
                                    <span style="width: 25%; float: left">Tên tệp</span>
                                    <span style="width: 75%; float: left"><b>{{documentFile.filename}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Tên tệp đầy đủ</span>
                                    <span style="width: 75%; float: left"><b>{{documentFile.storedFilename}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Mô tả</span>
                                    <span style="width: 75%; float: left"> {{documentFile.description}}</span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Thời điểm thêm vào</span>
                                    <span style="width: 25%; float: left">
                                        {{moment(documentFile.createdTime).format('DD/MM/YYYY HH:mm:ss')}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Người thêm vào</span>
                                    <span style="width: 25%; float: left">
                                        {{documentFile.creator.username}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>

                            </v-card-text>
                            <v-card-actions>
                                <v-flex>
                                    <v-btn color="primary"
                                           :href="`http://localhost:8080/document-files/${documentFile.id}/download`"
                                           target="_blank"
                                    >
                                        <v-icon left>mdi-download</v-icon>
                                        <span>Xem</span>

                                    </v-btn>
                                </v-flex>
                                <!--                                <v-flex v-if="username === documentFile.creator.username">-->
                                <!--                                    <DocumentFileForm :document="{...document}" :form="{...documentFile}"-->
                                <!--                                                  @refresh="getDocumentFiles">-->
                                <!--                                        <template #activator="{ on }">-->
                                <!--                                            <v-btn color="primary" v-on="on">-->
                                <!--                                                <v-icon left>mdi-pencil</v-icon>-->
                                <!--                                                <span>Sửa</span>-->
                                <!--                                            </v-btn>-->
                                <!--                                        </template>-->
                                <!--                                    </DocumentFileForm>-->
                                <!--                                </v-flex>-->
                                <!--                                <v-flex v-if="userId === documentFile.creator.id">-->
                                <!--                                    <v-btn color="error" @click="deleteFile(documentFile.id)">-->
                                <!--                                        <v-icon left>mdi-delete</v-icon>-->
                                <!--                                        <span>Xóa</span>-->
                                <!--                                    </v-btn>-->
                                <!--                                </v-flex>-->
                            </v-card-actions>
                        </v-card>
                    </div>
                </template>
            </v-container>
            <br v-if="!documentFiles.length">
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>


    import Axios from 'axios';
    import DocumentFileForm from "./DocumentFileForm";
    import {mapGetters} from "vuex";

    export default {
        name: "DocumentFile",
        components: {DocumentFileForm},
        data() {
            return {
                documentFilePanel: null,
                documentFileLoading: false,
                documentFileLoaded: false,
                documentFiles: [],
            }
        },
        props: {
            document: Object,
        },
        computed: {
            ...mapGetters('AUTHENTICATION_STORE', {
                username: 'username',
                isArchivist: 'isArchivist',
            }),
        },
        methods: {
            getDocumentFiles() {
                this.documentFileLoading = true;
                Axios.get(`http://localhost:8080/documents/${this.document.id}/files`)
                    .then(response => {
                        this.documentFiles = response.data;
                        this.documentFileLoaded = true;
                    })
                    .catch(error => console.log(error.response))
                    .finally(() => this.documentFileLoading = false);
            },
        },
        mounted() {

        },
        watch: {
            documentFilePanel(val) {
                if (val === 0) {
                    if (!this.documentFileLoaded) {
                        this.getDocumentFiles();
                    }
                }
            },
        },
    }
</script>

<style scoped>

</style>