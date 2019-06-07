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

                        <v-flex xs12 sm8 md10>
                            <v-autocomplete
                                    v-model="formData.outsider.id"
                                    :items="outsiderOptions"
                                    item-value="id"
                                    :item-text="itemText"
                                    :loading="outsiderOptionsLoading"
                                    :search-input.sync="outsiderOptionsSearch"
                                    label="Nơi ban hành"
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

                        <v-flex xs12 sm4 md2 pl-2>
                            <OutsiderForm creating @refresh="refreshOutsider">
                                <template #activator="{on}">
                                    <v-btn v-on="on" fab outline color="success"
                                           title="Tạo mới nơi ban hành">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                            </OutsiderForm>
                            <OutsiderForm :id="formData.outsider.id" @refresh="refreshOutsider">
                                <template #activator="{on}">
                                    <v-btn v-on="on" fab outline color="primary"
                                           title="Chỉnh sửa nơi ban hành" :disabled="formData.outsider.id === null">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                            </OutsiderForm>
                        </v-flex>

                        <v-flex xs12>
                            <v-textarea
                                    label="Trích yếu"
                                    v-model="formData.summary"
                                    outline
                            ></v-textarea>
                        </v-flex>

                        <v-flex xs12>
                            <v-textarea
                                    label="Thông tư/ Nghị định"
                                    v-model="formData.decree"
                                    outline
                            ></v-textarea>
                        </v-flex>

                        <v-flex xs12 sm8 md10>
                            <v-select
                                    label="Bản mẫu"
                                    v-model="templateId"
                                    :items="templateOptions"
                                    item-value="id"
                                    item-text="name"
                                    @input="getTemplateDetail"
                                    append-outer-icon="mdi-refresh"
                                    @click:append-outer="getTemplateOptions"
                                    :loading="templateOptionsLoading"
                            >
                            </v-select>

                        </v-flex>

                        <v-flex xs12 sm4 md2 pl-2>
                            <DocumentTemplateForm creating @refresh="refreshTemplates">
                                <template #activator="{on}">
                                    <v-btn v-on="on" fab outline color="success"
                                           title="Tạo mới bản mẫu">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                            </DocumentTemplateForm>
                            <DocumentTemplateForm :form="{...documentTemplate}" @refresh="refreshTemplates">
                                <template #activator="{on}">
                                    <v-btn v-on="on" fab outline color="primary"
                                           title="Chỉnh sửa bản mẫu" :disabled="templateId === null">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                            </DocumentTemplateForm>
                        </v-flex>

                        <v-flex xs12>
                            <v-label>Nội dung chi tiết</v-label>
                            <ckeditor :editor="editor"
                                      @ready="onEditorReady"
                                      v-model="formData.detail"
                                      :config="editorConfig"
                                      style="height: 500px"
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
                    <v-flex md3 xs6>
                        <v-btn color="secondary" @click="close" block>
                            <v-icon left>clear</v-icon>
                            Hủy
                        </v-btn>
                    </v-flex>
                    <v-flex md3 xs6>
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
    import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/vi'
    import DocumentTemplateForm from "./DocumentTemplateForm";
    import OutsiderForm from "@/components/outsiders/OutsiderForm";
    import {pushNotif} from "../../firebase";

    export default {
        name: "DocumentForm",
        components: {OutsiderForm, DocumentTemplateForm},
        props: {
            form: {
                type: Object,
                default() {
                    return {
                        code: null,
                        title: null,
                        summary: null,
                        decree: null,
                        detail: null,
                        arrivalDate: null,
                        effectiveDate: null,
                        effectiveEndDate: null,
                        outsider: {
                            id: null,
                        }
                    }
                }
            },
            creating: Boolean,
            internal: Boolean,
        },
        data() {
            return {
                dialog: false,
                loading: false,
                loaded: false,
                arrivalDateMenu: false,
                effectiveDateMenu: false,
                effectiveEndDateMenu: false,
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
                templateId: null,
                documentTemplate: null,
                templateOptions: [],
                templateOptionsLoading: false,
            }
        },
        computed: {
            formData() {
                return this.form;
            }
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                this.loading = true;
                const url = this.creating
                    ? `http://localhost:8080/documents`
                    : `http://localhost:8080/documents/${this.form.id}`;
                const data = this.formData;
                data.outsiderId = data.outsider.id;
                data.internal = this.internal;
                console.log(data);
                const method = this.creating ? 'POST' : 'PUT';
                Axios({url, data, method})
                    .then(response => {
                        this.close();
                        this.$emit("refresh");
                        var document = response.data;
                        Axios.get('http://localhost:8080/users/search/findAllDirector').then(response => {
                            var users = response.data;
                            if (users.length > 0) {
                                var title = this.creating ? "Văn bản mới" : "Văn  được chỉnh sửa";
                                var detail = document.title;
                                var url = `/documents/${document.id}`;
                                for (var i in users) {
                                    pushNotif(title, detail, url, users[i]);
                                }
                            }
                        }).catch(console.error)
                    })
                    .catch(error => {
                        if (error.response)
                            console.log(error.response);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            getOutsiderOptions() {
                this.outsiderOptionsLoading = true;
                Axios.get(`http://localhost:8080/outsiders`)
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
            refreshOutsider(id) {
                console.log('refresh');
                this.getOutsiderOptions();
                this.formData.outsider.id = id;
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
            },
            getTemplateOptions() {
                this.templateOptionsLoading = true;
                Axios.get(`http://localhost:8080/templates`)
                    .then(response => {
                        this.templateOptions = response.data;
                    })
                    .catch(error => {
                        if (error.response)
                            console.log(error.response);
                    })
                    .finally(() => {
                        this.templateOptionsLoading = false;
                    })
            },
            getTemplateDetail() {
                console.log('get template detail');
                Axios.get(`http://localhost:8080/templates/${this.templateId}`)
                    .then(response => {
                        this.documentTemplate = response.data;
                        this.formData.detail = this.documentTemplate.template;
                    })
                    .catch(error => {
                        if (error.response)
                            console.log(error.response);
                    })
            },
            refreshTemplates(id) {
                this.getTemplateOptions();
                this.templateId = id;
                this.getTemplateDetail();
            }
        },
        watch: {
            dialog(val) {
                if (val && !this.loaded) {
                    this.getTemplateOptions();
                    this.getOutsiderOptions();
                    this.loaded = true;
                }
            },
        },
        created() {

        }
    }
</script>

<style scoped>

</style>