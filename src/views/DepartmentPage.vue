<template>
    <DefaultLayout title="QUẢN LÝ PHÒNG ">
        <DepartmentTable></DepartmentTable>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import DepartmentTable from "../components/departments/DepartmentTable";
    export default {
        name: "DepartmentPage",
        components: {DepartmentTable, DefaultLayout}
    }
</script>

<style scoped>

</style>