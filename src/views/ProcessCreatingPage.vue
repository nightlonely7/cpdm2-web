<template>
    <DefaultLayout title="TẠO MỚI QUY TRÌNH">
        <ProcessCreating></ProcessCreating>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import ProcessCreating from "../components/processes/ProcessCreating";
    export default {
        name: "ProcessCreatingPage",
        components: {ProcessCreating, DefaultLayout}
    }
</script>

<style scoped>

</style>