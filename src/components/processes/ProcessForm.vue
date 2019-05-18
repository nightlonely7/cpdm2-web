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
                                    label="Tiêu đề"
                                    v-model="form.title"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea
                                    label="Trích yếu"
                                    v-model="form.summary"
                            ></v-textarea>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    label="Thông tư"
                                    v-model="form.title"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    label="Nghị định"
                                    v-model="form.title"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    label="Chi tiết"
                                    v-model="form.detail"
                            ></v-text-field>
                        </v-flex>

                        <v-flex md6 sm12>
                            <v-dialog
                                    ref="startDateDialog"
                                    v-model="startDateMenu"
                                    :return-value.sync="form.startDate"
                                    persistent
                                    lazy
                                    full-width
                                    width="300px"
                            >
                                <template #activator="{ on }">
                                    <v-text-field
                                            v-model="form.startDate"
                                            label="Ngày bắt đầu"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            clearable
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        v-if="startDateMenu"
                                        v-model="form.startDate"
                                        full-width
                                        locale="vi-vn"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="startDateMenu = false">
                                        Hủy
                                    </v-btn>
                                    <v-btn flat color="primary" @click="$refs.startDateDialog.save(form.startDate)">
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
    export default {
        name: "ProcessForm",
        props: {
            form: {
                type: Object,
                default() {
                    return {
                        title: '',
                        summary: '',
                        detail: '',
                        startDate: '',
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
                startDateMenu: false,
            }
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                this.loading = true;
                this.loading = false;
                this.close();
                this.$emit("refresh");
            }
        },
        watch: {
            dialog(val) {
                if (val && !this.loaded) {
                    this.loaded = true;
                }
            }
        }
    }
</script>

<style scoped>

</style>