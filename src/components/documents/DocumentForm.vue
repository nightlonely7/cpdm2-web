<template>
    <v-dialog v-model="dialog" persistent fullscreen transition="dialog-bottom-transition">
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card v-if="loaded">
            <v-toolbar dark color="primary">
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Tạo mới văn bản</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
                <v-container>
                    <v-layout wrap>

                        <v-flex xs12>
                            <v-text-field
                                    label="Số hiệu"
                                    v-model="formData.code"
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs12>
                            <v-text-field
                                    label="Tiêu đề"
                                    v-model="formData.title"
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs12>
                            <v-textarea
                                    label="Trích yếu"
                                    v-model="formData.summary"
                                    outline
                            ></v-textarea>
                        </v-flex>

                        <v-flex md12 sm12>
                            <v-autocomplete
                                    v-model="formData.outsiderId"
                                    :items="outsiderOptions"
                                    item-value="id"
                                    :item-text="itemText"
                                    :loading="outsiderOptionsLoading"
                                    :search-input.sync="outsiderOptionsSearch"
                                    label="Đối tượng ngoài"
                                    clearable
                                    hide-no-data
                                    cache-items
                            >
                                <template #item="{item}">
                                    {{item.code}} - {{item.name}}
                                </template>
                                <template #selection="{item}">
                                    {{item.code}} - {{item.name}}
                                </template>
                            </v-autocomplete>
                        </v-flex>

                        <v-flex xs12>
                            <v-textarea
                                    label="Thông tư/ Nghị định"
                                    v-model="formData.decree"
                                    outline
                            ></v-textarea>
                        </v-flex>

                        <v-flex xs12>
                            <v-label>Chi tiết</v-label>
                            <ckeditor :editor="editor"
                                      @ready="onEditorReady"
                                      v-model="formData.detail"
                                      :config="editorConfig"
                            ></ckeditor>
                        </v-flex>

                        <!--Arrival Date-->
                        <v-flex md6 sm12>
                            <v-dialog
                                    ref="arrivalDateDialog"
                                    v-model="arrivalDateMenu"
                                    :return-value.sync="formData.arrivalDate"
                                    persistent
                                    lazy
                                    full-width
                                    width="300px"
                            >
                                <template #activator="{ on }">
                                    <v-text-field
                                            v-model="formData.arrivalDate"
                                            label="Ngày văn bản đến"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            clearable
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        v-if="arrivalDateMenu"
                                        v-model="formData.arrivalDate"
                                        full-width
                                        locale="vi-vn"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="arrivalDateMenu = false">
                                        Hủy
                                    </v-btn>
                                    <v-btn flat color="primary"
                                           @click="$refs.arrivalDateDialog.save(formData.arrivalDate)">
                                        Lưu
                                    </v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>

                        <v-flex md6></v-flex>

                        <!--Effective Date-->
                        <v-flex md6 sm12>
                            <v-dialog
                                    ref="effectiveDateDialog"
                                    v-model="effectiveDateMenu"
                                    :return-value.sync="formData.effectiveDate"
                                    persistent
                                    lazy
                                    full-width
                                    width="300px"
                            >
                                <template #activator="{ on }">
                                    <v-text-field
                                            v-model="formData.effectiveDate"
                                            label="Ngày bắt đầu hiệu lực"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            clearable
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        v-if="effectiveDateMenu"
                                        v-model="formData.effectiveDate"
                                        full-width
                                        locale="vi-vn"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="effectiveDateMenu = false">
                                        Hủy
                                    </v-btn>
                                    <v-btn flat color="primary"
                                           @click="$refs.effectiveDateDialog.save(formData.effectiveDate)">
                                        Lưu
                                    </v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>

                        <!--Effective End Date-->
                        <v-flex md6 sm12>
                            <v-dialog
                                    ref="effectiveEndDateDialog"
                                    v-model="effectiveEndDateMenu"
                                    :return-value.sync="formData.effectiveEndDate"
                                    persistent
                                    lazy
                                    full-width
                                    width="300px"
                            >
                                <template #activator="{ on }">
                                    <v-text-field
                                            v-model="formData.effectiveEndDate"
                                            label="Ngày hết hiệu lực"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            clearable
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        v-if="effectiveEndDateMenu"
                                        v-model="formData.effectiveEndDate"
                                        full-width
                                        locale="vi-vn"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="effectiveEndDateMenu = false">
                                        Hủy
                                    </v-btn>
                                    <v-btn flat color="primary"
                                           @click="$refs.effectiveEndDateDialog.save(formData.effectiveEndDate)">
                                        Lưu
                                    </v-btn>
                                </v-date-picker>
                            </v-dialog>
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
    </v-dialog>
</template>

<script>
    import Axios from 'axios'
    import _ from 'lodash'
    import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/vi'

    export default {
        name: "DocumentForm",
        props: {
            form: {
                type: Object,
                default() {
                    return {
                        code: '',
                        title: '',
                        summary: '',
                        decree: '',
                        detail: '',
                        arrivalDate: '',
                        effectiveDate: '',
                        effectiveEndDate: '',
                        outsiderId: 0,
                    }
                }
            },
            creating: Boolean,
        },
        data() {
            return {
                dialog: false,
                loading: false,
                loaded: false,
                arrivalDateMenu: false,
                effectiveDateMenu: false,
                effectiveEndDateMenu: false,
                formData: this.form,
                outsiderOptions: [],
                outsiderOptionsLoading: false,
                outsiderOptionsSearch: null,
                editor: DecoupledEditor,
                editorData: '',
                editorConfig: {
                    language: 'vi',
                    toolbar: [
                        'heading', '|',
                        'fontSize', 'fontFamily', '|',
                        'bold', 'italic', 'underline', 'strikeThrough', 'highlight', '|',
                        'alignment', '|',
                        'bulletedList', 'numberedList', 'blockQuote', 'insertTable', '|',
                        'undo', 'redo'],
                },
            }
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                console.log(this.formData);
                this.loading = true;
                const url = `http://localhost:8080/documents`;
                const data = this.formData;
                const method = this.creating ? 'POST' : 'PUT';
                Axios({url, data, method})
                    .then(response => {
                        this.close();
                        this.$emit("refresh");
                    })
                    .catch(error => {
                        if (error.response)
                            console.log(error.response);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            getOutsiderOptions(searchValue) {
                console.log(searchValue);
                this.outsiderOptionsLoading = true;
                Axios.get(`http://localhost:8080/outsiders/search/findAllSummaryByNameContainsOrCodeContains`, {
                    params: {
                        name: searchValue,
                        code: searchValue,
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        this.outsiderOptions = response.data;
                    })
                    .catch(error => {
                        if (error.response)
                            console.log(error.response);
                    })
                    .finally(() => {
                        this.outsiderOptionsLoading = false;
                    })
            },
            onEditorReady(editor) {
                // Insert the toolbar before the editable area.
                editor.ui.view.editable.element.parentElement.insertBefore(
                    editor.ui.view.toolbar.element,
                    editor.ui.view.editable.element
                );
            },
            itemText(item) {
                return `${item.code} - ${item.name}`;
            }
        },
        watch: {
            dialog(val) {
                if (val && !this.loaded) {
                    this.loaded = true;
                }
            },
            outsiderOptionsSearch(val) {
                if (val && !!val.trim().length) {
                    this.debouncedGetOutsiderOptions(val.trim());
                }
            }
        },
        created() {
            this.debouncedGetOutsiderOptions = _.debounce(this.getOutsiderOptions, 500);
        }
    }
</script>

<style scoped>
    .ck-editor__editable {
        min-height: 500px;
    }
</style>