<template>
    <v-dialog v-model="dialog" persistent width="500px">
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card v-if="loaded">
            <v-toolbar dark color="primary">
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Xử lý văn bản</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
                <v-container>
                    <v-layout wrap>

                        <v-flex xs12>
                            <v-textarea
                                    label="Phản hồi"
                                    v-model="formData.feedback"
                            ></v-textarea>
                        </v-flex>
                        <v-flex xs12>
                            <v-select
                                    label="Kết quả xử lý"
                                    v-model="outcomeId"
                                    :items="outcomeOptions"
                                    item-value="id"
                                    item-text="name"
                            >
                                <template #item="{item}">
                                    {{item.name}} - {{item.description}}
                                </template>
                            </v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-layout row justify-space-around>
                    <v-flex md4 xs6>
                        <v-btn color="secondary" @click="close" block>
                            <v-icon left>clear</v-icon>
                            Hủy
                        </v-btn>
                    </v-flex>
                    <v-flex md4 xs6>
                        <v-btn color="primary" @click="save" block :loading="loading">
                            <v-icon left>done</v-icon>
                            Xử lý
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';
    import {pushNotif} from "../../firebase";

    export default {
        name: "DocumentExecutingForm",
        data() {
            return {
                dialog: false,
                loaded: false,
                loading: false,
                formData: {},
                outcomeOptions: [],
                outcomeId: 0,
            }
        },
        props: {
            document: Object,
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                this.loading = true;
                Axios.patch(
                    `http://localhost:8080/documents/${this.document.id}/forward_process?outcomeId=${this.outcomeId}`,
                    this.formData, {params: {outcomeId: this.outcomeId}})
                    .then((response) => {
                        this.close();
                        this.$emit('refresh');
                        var document = response.data;
                        var user = document.currentStep.executor;
                        var title = "Văn bản cần xử lý";
                        var detail = document.title;
                        var url = `/documents/${document.id}`;
                        pushNotif(title, detail, url, user);
                    })
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
            getOutcomeOptions() {
                Axios.get(`http://localhost:8080/steps/${this.document.currentStep.id}/outcomes`)
                    .then(response => {
                        this.outcomeOptions = response.data;
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
            },
        },
        watch: {
            dialog(val) {
                if (val && !this.loaded) {
                    this.getOutcomeOptions();
                }
            }
        }
    }
</script>

<style scoped>

</style>