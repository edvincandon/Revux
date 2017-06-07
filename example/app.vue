<template>
    <div id="appRoot">
        <p>
            <router-link to="/">Home</router-link>
            <router-link to="/test">Test</router-link>
        </p>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    // empty
}
</script>
