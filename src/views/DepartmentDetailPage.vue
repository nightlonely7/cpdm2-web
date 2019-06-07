<template>
    <DefaultLayout title="CHI TIẾT PHÒNG BAN">
        <DepartmentDetail :id="id"></DepartmentDetail>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import DepartmentDetail from "../components/departments/DepartmentDetail";
    export default {
        name: "DepartmentDetailPage",
        components: {DepartmentDetail, DefaultLayout},
        data(){
            return {
                id: Number.parseInt(this.$route.params.id),
            }
        },
    }
</script>

<style scoped>

</style>