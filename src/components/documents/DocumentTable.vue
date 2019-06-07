<template>
    <div class="elevation-1">
        <v-expansion-panel class="elevation-0">
            <v-expansion-panel-content>
                <template #header>
                    <span><v-icon left>search</v-icon>
                    Tìm kiếm
                    </span>
                </template>
                <v-card>
                    <v-card-text>
                        <v-btn color="primary" @click="resetSearch">Đặt lại</v-btn>
                        <v-text-field v-model.trim="documentSearchForm.code"
                                      label="Tìm bởi số hiệu"
                                      clearable
                        ></v-text-field>
                        <v-select
                                v-model="documentSearchForm.typeId"
                                :items="typeOptions"
                                item-value="id"
                                item-text="name"
                                append-outer-icon="mdi-refresh"
                                @click:append-outer="getTypeOptions"
                                label="Loại văn bản"
                                clearable
                                hide-no-data
                        >
                        </v-select>
                        <v-text-field v-model.trim="documentSearchForm.title"
                                      label="Tìm bởi tiêu đề"
                                      clearable
                        ></v-text-field>
                        <v-text-field v-model.trim="documentSearchForm.summary"
                                      label="Tìm bởi trích yếu"
                                      clearable
                        ></v-text-field>
                        <v-text-field v-model.trim="documentSearchForm.decree"
                                      label="Tìm bởi thông tư / nghị định"
                                      clearable
                        ></v-text-field>
                        <v-text-field v-model.trim="documentSearchForm.detail"
                                      label="Tìm bởi nội dung chi tiết"
                                      clearable
                        ></v-text-field>
                        <v-expansion-panel>
                            <v-expansion-panel-content>
                                <template #header>
                                    <span><v-icon left>search</v-icon>
                                        Tìm kiếm theo nơi ban hành
                                    </span>
                                </template>
                                <v-card>
                                    <v-card-text>
                                        <v-text-field v-model.trim="documentSearchForm.outsiderCode"
                                                      label="Tìm bởi mã"
                                                      clearable
                                        ></v-text-field>
                                        <v-text-field v-model.trim="documentSearchForm.outsiderName"
                                                      label="Tìm bởi tên"
                                                      clearable
                                        ></v-text-field>
                                        <v-text-field v-model.trim="documentSearchForm.outsiderContactData"
                                                      label="Tìm bởi thông tin liên lạc"
                                                      clearable
                                        ></v-text-field>
                                    </v-card-text>

                                </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-layout row wrap>

                            <!--Created Time From-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="createdTimeFromDialog"
                                        v-model="createdTimeFromMenu"
                                        :return-value.sync="documentSearchForm.createdTimeFrom"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.createdTimeFrom"
                                                label="Ngày tạo từ"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="createdTimeFromMenu"
                                            v-model="documentSearchForm.createdTimeFrom"
                                            :max="documentSearchForm.createdTimeTo"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="createdTimeFromMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.createdTimeFromDialog.save(documentSearchForm.createdTimeFrom)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--Created Time To-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="createdTimeToDialog"
                                        v-model="createdTimeToMenu"
                                        :return-value.sync="documentSearchForm.createdTimeTo"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.createdTimeTo"
                                                label="Ngày tạo đến"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="createdTimeToMenu"
                                            v-model="documentSearchForm.createdTimeTo"
                                            :min="documentSearchForm.createdTimeFrom"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="createdTimeToMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.createdTimeToDialog.save(documentSearchForm.createdTimeTo)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--Last Modified Time From-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="lastModifiedTimeFromDialog"
                                        v-model="lastModifiedTimeFromMenu"
                                        :return-value.sync="documentSearchForm.lastModifiedTimeFrom"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.lastModifiedTimeFrom"
                                                label="Ngày chỉnh sửa gần nhất từ"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="lastModifiedTimeFromMenu"
                                            v-model="documentSearchForm.lastModifiedTimeFrom"
                                            :max="documentSearchForm.lastModifiedTimeTo"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="lastModifiedTimeFromMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.lastModifiedTimeFromDialog.save(documentSearchForm.lastModifiedTimeFrom)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--Last Modified Time To-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="lastModifiedTimeToDialog"
                                        v-model="lastModifiedTimeToMenu"
                                        :return-value.sync="documentSearchForm.lastModifiedTimeTo"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.lastModifiedTimeTo"
                                                label="Ngày chỉnh sửa gần nhất đến"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="lastModifiedTimeToMenu"
                                            v-model="documentSearchForm.lastModifiedTimeTo"
                                            :min="documentSearchForm.lastModifiedTimeFrom"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="lastModifiedTimeToMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.lastModifiedTimeToDialog.save(documentSearchForm.lastModifiedTimeTo)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--Arrival Date From-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="arrivalDateFromDialog"
                                        v-model="arrivalDateFromMenu"
                                        :return-value.sync="documentSearchForm.arrivalDateFrom"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.arrivalDateFrom"
                                                label="Ngày nhận từ"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="arrivalDateFromMenu"
                                            v-model="documentSearchForm.arrivalDateFrom"
                                            :max="documentSearchForm.arrivalDateTo"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="arrivalDateFromMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.arrivalDateFromDialog.save(documentSearchForm.arrivalDateFrom)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--Arrival Date To-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="arrivalDateToDialog"
                                        v-model="arrivalDateToMenu"
                                        :return-value.sync="documentSearchForm.arrivalDateTo"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.arrivalDateTo"
                                                label="Ngày nhận đến"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="arrivalDateToMenu"
                                            v-model="documentSearchForm.arrivalDateTo"
                                            :min="documentSearchForm.arrivalDateFrom"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="arrivalDateToMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.arrivalDateToDialog.save(documentSearchForm.arrivalDateTo)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--Effective Date From-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="effectiveDateFromDialog"
                                        v-model="effectiveDateFromMenu"
                                        :return-value.sync="documentSearchForm.effectiveDateFrom"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.effectiveDateFrom"
                                                label="Ngày có hiệu lực từ"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="effectiveDateFromMenu"
                                            v-model="documentSearchForm.effectiveDateFrom"
                                            :max="documentSearchForm.effectiveDateTo"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="effectiveDateFromMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.effectiveDateFromDialog.save(documentSearchForm.effectiveDateFrom)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--Effective Date To-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="effectiveDateToDialog"
                                        v-model="effectiveDateToMenu"
                                        :return-value.sync="documentSearchForm.effectiveDateTo"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.effectiveDateTo"
                                                label="Ngày có hiệu lực đến"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="effectiveDateToMenu"
                                            v-model="documentSearchForm.effectiveDateTo"
                                            :min="documentSearchForm.effectiveDateFrom"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="effectiveDateToMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.effectiveDateToDialog.save(documentSearchForm.effectiveDateTo)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--Effective End Date From-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="effectiveEndDateFromDialog"
                                        v-model="effectiveEndDateFromMenu"
                                        :return-value.sync="documentSearchForm.effectiveEndDateFrom"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.effectiveEndDateFrom"
                                                label="Ngày hết hiệu lực từ"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="effectiveEndDateFromMenu"
                                            v-model="documentSearchForm.effectiveEndDateFrom"
                                            :max="documentSearchForm.effectiveEndDateTo"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="effectiveEndDateFromMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.effectiveEndDateFromDialog.save(documentSearchForm.effectiveEndDateFrom)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--Effective End Date To-->
                            <v-flex xs12 sm6 md6>
                                <v-dialog
                                        ref="effectiveEndDateToDialog"
                                        v-model="effectiveEndDateToMenu"
                                        :return-value.sync="documentSearchForm.effectiveEndDateTo"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="documentSearchForm.effectiveEndDateTo"
                                                label="Ngày hết hiệu lực đến"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="effectiveEndDateToMenu"
                                            v-model="documentSearchForm.effectiveEndDateTo"
                                            :min="documentSearchForm.effectiveEndDateFrom"
                                            full-width
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary"
                                               @click="effectiveEndDateToMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.effectiveEndDateToDialog.save(documentSearchForm.effectiveEndDateTo)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>
                        </v-layout>
                        <div>
                            <v-label>Trạng thái</v-label>
                            <v-layout wrap>

                                <v-flex>
                                    <v-checkbox v-model="documentSearchForm.startedProcessing"
                                                label="Đang xử lý"
                                                :disabled="documentSearchForm.processed"
                                    ></v-checkbox>
                                </v-flex>
                                <v-flex>
                                    <v-checkbox v-model="documentSearchForm.processed"
                                                label="Đã xử lý"
                                                :disabled="documentSearchForm.startedProcessing"
                                    >Đã xử lý
                                    </v-checkbox>
                                </v-flex>
                            </v-layout>
                        </div>


                    </v-card-text>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-toolbar tabs flat fixed-tabs class="elevation-0">

            <v-tabs
                    v-model="tabs"
                    slider-color="primary"
                    color="transparent"
            >
                <v-tab>
                    <v-icon color="primary">mdi-arrow-collapse-down</v-icon>&nbsp;
                    TẤT CẢ VĂN BẢN LIÊN QUAN
                </v-tab>
                <v-tab v-show="!internal && !isArchivist">
                    <v-icon color="primary">mdi-share</v-icon>&nbsp;
                    VĂN BẢN CHỜ XỬ LÝ
                </v-tab>
                <v-tab v-show="isArchivist">
                    <v-icon color="primary">mdi-share</v-icon>&nbsp;
                    VĂN BẢN BỊ TỪ CHỐI
                </v-tab>
            </v-tabs>

        </v-toolbar>
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>mdi-file-document</v-icon>
                QUẢN LÝ VĂN BẢN
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">
                <v-icon left>mdi-refresh</v-icon>
                Tải lại
            </v-btn>
            <v-spacer></v-spacer>
            <DocumentForm @refresh="refresh" creating :internal="internal" v-if="isAdmin || isArchivist">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">
                        <v-icon left>add</v-icon>
                        Tạo mới văn bản
                    </v-btn>
                </template>
            </DocumentForm>
        </v-toolbar>
        <v-data-table
                :items="documents"
                :headers="headers"
                :loading="loading"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                :rows-per-page-text="'Số hàng mỗi trang'"
                :rows-per-page-items="[10, 25, 50, {text: 'Tất cả', value: -1}]"
                :no-data-text="'Không có dữ liệu'"
                :no-results-text="'Không tìm thấy dữ liệu tương ứng'"
                :must-sort="true"
                class="elevation-0"
        >

            <template #pageText="{pageStart, pageStop, itemsLength}">
                {{pageStart}} - {{pageStop}} của tổng cộng {{itemsLength}}
            </template>

            <template #items="{item}">
                <td class="text-xs-left">{{item.code}}</td>
                <td class="text-xs-left">{{item.type.name}}</td>
                <td class="text-xs-left">{{item.title}}</td>
                <td class="text-xs-left">{{item.summary}}</td>
                <td class="text-xs-left">{{item.outsider.name}}</td>
                <td class="text-xs-left">{{moment(item.createdTime).format('HH:mm:ss DD/MM/YYYY')}}</td>
                <td class="text-xs-left">{{moment(item.arrivalDate).format('DD/MM/YYYY')}}</td>
                <td class="text-xs-left">{{item.processed ? 'Đã xử lý': 'Chưa xử lý'}}</td>
                <td class="text-xs-left">
                    <router-link :to="`/documents/${item.id}`">Xem chi tiết</router-link>
                </td>
            </template>

        </v-data-table>
    </div>
</template>

<script>
    import Axios from 'axios'
    import DocumentForm from "@/components/documents/DocumentForm";
    import {mapGetters} from "vuex";
    import _ from 'lodash'

    export default {
        name: "DocumentTable",
        components: {DocumentForm},
        props: {
            internal: Boolean,
        },
        data() {
            return {
                tabs: 0,
                executing: false,
                rejected: false,
                documents: [],
                loading: false,
                headers: [
                    {text: 'Số hiệu', value: 'code'},
                    {text: 'Loại', value: 'type.name'},
                    {text: 'Tiêu đề', value: 'title'},
                    {text: 'Trích yếu', value: 'summary'},
                    {text: 'Nơi ban hành', value: 'outsider.name'},
                    {text: 'Thời gian tạo', value: 'createdTime'},
                    {text: 'Ngày nhận', value: 'arrivalDate'},
                    {text: 'Trạng thái', value: 'processed'},
                    {text: 'Thao tác', value: null},
                ],
                pagination: {
                    sortBy: 'createdTime',
                    descending: true
                },
                documentSearchForm: {
                    code: null,
                    typeId: null,
                    title: null,
                    summary: null,
                    decree: null,
                    detail: null,
                    outsiderCode: null,
                    outsiderName: null,
                    outsiderContactData: null,
                    createdTimeFrom: null,
                    createdTimeTo: null,
                    lastModifiedTimeFrom: null,
                    lastModifiedTimeTo: null,
                    arrivalDateFrom: null,
                    arrivalDateTo: null,
                    effectiveDateFrom: null,
                    effectiveDateTo: null,
                    effectiveEndDateFrom: null,
                    effectiveEndDateTo: null,
                    startedProcessing: null,
                    processed: null,
                },
                createdTimeFromMenu: false,
                createdTimeToMenu: false,
                lastModifiedTimeFromMenu: false,
                lastModifiedTimeToMenu: false,
                arrivalDateFromMenu: false,
                arrivalDateToMenu: false,
                effectiveDateFromMenu: false,
                effectiveDateToMenu: false,
                effectiveEndDateFromMenu: false,
                effectiveEndDateToMenu: false,
                typeOptions: [],
            }
        },
        computed: {
            ...mapGetters('AUTHENTICATION_STORE', {
                isAdmin: 'isAdmin',
                isArchivist: 'isArchivist'
            })
        },
        methods: {
            refresh() {
                this.getDocuments();
            },
            getDocuments() {
                this.loading = true;
                const url = this.executing ?
                    `http://localhost:8080/documents/search/executing` :
                    `http://localhost:8080/documents`;
                const params = {...this.documentSearchForm};
                params.createdTimeFrom = params.createdTimeFrom && params.createdTimeFrom.concat('T00:00');
                params.createdTimeTo = params.createdTimeTo && params.createdTimeTo.concat('T00:00');
                params.lastModifiedTimeFrom = params.lastModifiedTimeFrom && params.lastModifiedTimeFrom.concat('T00:00');
                params.lastModifiedTimeTo = params.lastModifiedTimeTo && params.lastModifiedTimeTo.concat('T00:00');
                if (this.internal) {
                    params.internal = true;
                }
                if (this.isAdmin) {
                    params.sent = true;
                }
                if (this.rejected) {
                    params.rejected = true;
                }
                console.log(params);
                Axios.get(url, {params})
                    .then(response => {
                        this.documents = response.data.content;
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            },
            resetSearch() {
                Object.keys(this.documentSearchForm).forEach(index =>
                    this.documentSearchForm[index] = null
                );
            },
            getTypeOptions() {
                Axios.get(`http://localhost:8080/document-types`)
                    .then(response => {
                        this.typeOptions = response.data;
                    })
                    .catch(error => {
                        if (error.response)
                            console.log(error.response);
                    })
            },
        },
        watch: {
            pagination() {
                this.getDocuments();
            },
            tabs(val) {
                switch (val) {
                    case 0:
                        this.executing = false;
                        this.rejected = false;
                        this.getDocuments();
                        break;
                    case 1:
                        this.executing = true;
                        this.rejected = false;
                        this.getDocuments();
                        break;
                    case 2:
                        this.executing = false;
                        this.rejected = true;
                        this.getDocuments();
                        break;
                    default:
                        this.getDocuments();
                }
            },
            documentSearchForm: {
                handler() {
                    this.pagination.page = 1;
                    this.debouncedGetDocuments();
                },
                deep: true
            }
        },
        created() {
            this.debouncedGetDocuments = _.debounce(this.getDocuments, 500);
        },
        mounted() {
            this.getTypeOptions();
        }
    }
</script>

<style scoped>

</style>