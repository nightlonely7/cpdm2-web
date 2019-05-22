<template>
    <DefaultLayout title="QUẢN LÝ VĂN BẢN">
        <DocumentTable></DocumentTable>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from "@/layouts/DefaultLayout";
    import DocumentTable from "@/components/documents/DocumentTable";

    export default {
        name: "DocumentPage",
        components: {DocumentTable, DefaultLayout},
    }
</script>

<style scoped>

</style>