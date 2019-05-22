<template>
    <div class="elevation-1">
        <v-toolbar tabs flat fixed-tabs>

                <v-tabs
                        v-model="tabs"
                        slider-color="primary"
                        color="transparent"
                >
                    <v-tab>
                        <v-icon color="primary">mdi-arrow-collapse-down</v-icon>&nbsp;TẤT CẢ VĂN BẢN LIÊN QUAN
                    </v-tab>
                    <v-tab>
                        <v-icon color="primary">mdi-share</v-icon>&nbsp;VĂN BẢN CHỜ XỬ LÝ
                    </v-tab>
                </v-tabs>

        </v-toolbar>
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>mdi-file-document</v-icon>
                {{executing ? 'VĂN BẢN CHỜ XỬ LÝ' : 'QUẢN LÝ VĂN BẢN'}}
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">
                <v-icon left>mdi-refresh</v-icon>
                Tải lại
            </v-btn>
            <v-spacer></v-spacer>
            <DocumentForm @refresh="refresh" creating>
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
        >

            <template #pageText="{pageStart, pageStop, itemsLength}">
                {{pageStart}} - {{pageStop}} của tổng cộng {{itemsLength}}
            </template>

            <template #items="{item}">
                <td class="text-xs-left">{{item.title}}</td>
                <td class="text-xs-left">{{item.summary}}</td>
                <td class="text-xs-left">{{moment(item.createdTime).format('HH:mm:ss DD-MM-YYYY')}}</td>
                <td class="text-xs-left">{{moment(item.lastModifiedTime).format('HH:mm:ss DD-MM-YYYY')}}</td>
            </template>

        </v-data-table>
    </div>
</template>

<script>
    import Axios from 'axios'
    import DocumentForm from "@/components/documents/DocumentForm";

    export default {
        name: "DocumentTable",
        components: {DocumentForm},
        props: {
            executing: Boolean,
        },
        data() {
            return {
                tabs: 1,
                documents: [],
                loading: false,
                headers: [
                    {text: 'Tiêu đề', value: 'title'},
                    {text: 'Trích yếu', value: 'summary'},
                    {text: 'Thời gian tạo', value: 'createdTime'},
                    {text: 'Thời gian chỉnh sửa gần nhất', value: 'lastModifiedTime'},
                ],
                pagination: {
                    sortBy: 'createdTime',
                    descending: true
                },
            }
        },
        methods: {
            refresh() {
                this.getDocuments();
            },
            getDocuments() {
                this.loading = true;
                const url = this.executing ?
                    `http://localhost:8080/documents/executing` :
                    `http://localhost:8080/documents/creates`;
                Axios.get(url)
                    .then(response => {
                        this.documents = response.data.content;
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            }
        },
        watch: {
            pagination() {
                this.getDocuments();
            },
            tabs(val) {
                switch (val) {
                    case 0:
                        this.executing = false;
                        this.getDocuments();
                        break;
                    case 1:
                        this.executing = true;
                        this.getDocuments();
                        break;
                    default:
                        this.getDocuments();
                }
            }
        }
    }
</script>

<style scoped>

</style>