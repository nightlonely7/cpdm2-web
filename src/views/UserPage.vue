<template>
    <DefaultLayout title="Quản lý người dùng">
        <UserTable></UserTable>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import UserTable from "../components/users/UserTable";
    export default {
        name: "UserPage",
        components: {UserTable, DefaultLayout}
    }
</script>

<style scoped>

</style>