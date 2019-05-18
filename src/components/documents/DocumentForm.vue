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
                                    v-model="form.code"
                            ></v-text-field>
                        </v-flex>

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
                                    outline
                            ></v-textarea>
                        </v-flex>

                        <v-flex xs12>
                            <v-textarea
                                    label="Thông tư/ Nghị định"
                                    v-model="form.decree"
                                    outline
                            ></v-textarea>
                        </v-flex>

                        <v-flex xs12>
                            <v-text-field
                                    label="Chi tiết"
                                    v-model="form.detail"
                            ></v-text-field>
                        </v-flex>

                         <!--Arrival Date-->
                        <v-flex md6 sm12>
                            <v-dialog
                                    ref="arrivalDateDialog"
                                    v-model="arrivalDateMenu"
                                    :return-value.sync="form.arrivalDate"
                                    persistent
                                    lazy
                                    full-width
                                    width="300px"
                            >
                                <template #activator="{ on }">
                                    <v-text-field
                                            v-model="form.arrivalDate"
                                            label="Ngày văn bán đến"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            clearable
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        v-if="arrivalDateMenu"
                                        v-model="form.arrivalDate"
                                        full-width
                                        locale="vi-vn"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="arrivalDateMenu = false">
                                        Hủy
                                    </v-btn>
                                    <v-btn flat color="primary" @click="$refs.arrivalDateDialog.save(form.arrivalDate)">
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
                                    :return-value.sync="form.effectiveDate"
                                    persistent
                                    lazy
                                    full-width
                                    width="300px"
                            >
                                <template #activator="{ on }">
                                    <v-text-field
                                            v-model="form.effectiveDate"
                                            label="Ngày bắt đầu hiệu lực"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            clearable
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        v-if="effectiveDateMenu"
                                        v-model="form.effectiveDate"
                                        full-width
                                        locale="vi-vn"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="effectiveDateMenu = false">
                                        Hủy
                                    </v-btn>
                                    <v-btn flat color="primary" @click="$refs.effectiveDateDialog.save(form.effectiveDate)">
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
                                    :return-value.sync="form.effectiveEndDate"
                                    persistent
                                    lazy
                                    full-width
                                    width="300px"
                            >
                                <template #activator="{ on }">
                                    <v-text-field
                                            v-model="form.effectiveEndDate"
                                            label="Ngày hết hiệu lực"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            clearable
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        v-if="effectiveEndDateMenu"
                                        v-model="form.effectiveEndDate"
                                        full-width
                                        locale="vi-vn"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="effectiveEndDateMenu = false">
                                        Hủy
                                    </v-btn>
                                    <v-btn flat color="primary" @click="$refs.effectiveEndDateDialog.save(form.effectiveEndDate)">
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