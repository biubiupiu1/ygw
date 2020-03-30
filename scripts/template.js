// template.js
module.exports = {
    vueTemplate: compoenntName => `<template>
    <div class="${compoenntName}">
        ${compoenntName}组件
    </div>
</template>
<script>
export default {
    name: '${compoenntName}',
};
</script>

<style lang="scss" scoped>
@import './${compoenntName}';
</style>
`,
    entryTemplate: (compoenntName) => {
        let arr = compoenntName.split('-');
        arr = arr.map(item => item.replace(/./, match => match.toUpperCase()));

        const exportName = arr.join('');

        return `import ${exportName} from './${compoenntName}.vue;'

export default ${exportName};`;
    },

    routerTemplate: (Name) => {
        const tempName = Name.replace(/./, match => match.toLowerCase());
        return `import ${Name} from "../../views/${Name}/${Name}.vue";

export default [
    {
        path: '/${tempName}',
        name: ${Name},
        component: ${Name},
    },
];`;
    },
    cssTemplate: () => '',
};
