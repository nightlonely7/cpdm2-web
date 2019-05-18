<template>
    <DefaultLayout title="QUẢN LÝ QUY TRÌNH">
        <ProcessTable></ProcessTable>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from "@/layouts/DefaultLayout";
    import ProcessTable from "@/components/processes/ProcessTable";
    export default {
        name: "ProcessPage",
        components: {ProcessTable, DefaultLayout}
    }
</script>

<style scoped>

</style>