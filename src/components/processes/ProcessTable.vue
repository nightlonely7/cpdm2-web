<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>timeline</v-icon>
                QUẢN LÝ QUY TRÌNH
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">
                <v-icon left>mdi-refresh</v-icon>
                Tải lại
            </v-btn>
            <v-spacer></v-spacer>
            <ProcessForm @refresh="refresh">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">
                        <v-icon left>add</v-icon>
                        Tạo mới quy trình
                    </v-btn>
                </template>
            </ProcessForm>
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
    import Axios from 'axios';
    import ProcessForm from "./ProcessForm";
    export default {
        name: "ProcessTable",
        components: {ProcessForm},
        data() {
            return {
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
                Axios.get(`http://localhost:8080/documents/creates`)
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
            }
        }
    }
</script>

<style scoped>

</style>