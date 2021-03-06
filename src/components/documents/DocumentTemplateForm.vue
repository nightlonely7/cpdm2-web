<template>
    <v-dialog v-model="dialog" persistent width="1000px">
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card v-if="loaded">
            <v-toolbar dark color="primary">
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>
                    {{creating ? 'Tạo mới bản mẫu' : 'Chỉnh sửa bản mẫu'}}
                </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
                <v-container>
                    <v-layout wrap>

                        <v-flex xs12>
                            <v-text-field
                                    label="Tên bản mẫu"
                                    v-model="formData.name"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-label>Nội dung chi tiết</v-label>
                            <ckeditor :editor="editor"
                                      @ready="onEditorReady"
                                      v-model="formData.template"
                                      :config="editorConfig"
                                      style="height: 500px"
                            ></ckeditor>
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

    export default {
        name: "DocumentTemplateForm",
        props: {
            form: {
                type: Object,
                default() {
                    return {
                        id: null,
                        name: null,
                        template: null,
                    }
                }
            },
            creating: Boolean,
        },
        data() {
            return {
                loaded: false,
                loading: false,
                dialog: false,
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
                const url = this.creating ?
                    `http://localhost:8080/templates` :
                    `http://localhost:8080/templates/${this.formData.id}`;
                const method = this.creating ? 'POST' : 'PUT';
                const data = this.formData;
                Axios({url, method, data})
                    .then(response => {
                        this.close();
                        this.$emit('refresh', response.data.id);
                    })
                    .catch(error => {
                        if (error.response)
                            console.log(error.response);
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            onEditorReady(editor) {
                editor.ui.view.editable.element.parentElement.insertBefore(
                    editor.ui.view.toolbar.element,
                    editor.ui.view.editable.element
                );
            },
        },
        watch: {
            dialog(val) {
                if (val && !this.loaded) {
                    this.loaded = true;
                }
            },
        }
    }
</script>

<style scoped>

</style>