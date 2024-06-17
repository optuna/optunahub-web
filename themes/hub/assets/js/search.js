const { createApp, ref, computed } = Vue;

const app = createApp({
  setup() {
    const query = ref('');
    const fuse = ref(null);
    const docs = computed(() => {
      if (fuse.value) {
        if (query.value) {
          return fuse.value.search(query.value);
        }
        return fuse.value._docs.map((item) => ({ item }));
      }
      return [];
    });

    fetch('/index.json')
      .then((resp) => resp.json())
      .then((data) => {
        fuse.value = new Fuse(data, {
          threshold: 0.1,
          useExtendedSearch: true,
          keys: ['title', 'description', 'tags.title'],
        });
      });

    return {
      query,
      docs,
    };
  },
});

app.config.compilerOptions.delimiters = ['[[', ']]'];

app.mount('#search');
