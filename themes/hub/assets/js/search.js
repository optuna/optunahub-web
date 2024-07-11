const { createApp, ref, computed } = Vue;

const app = createApp({
  setup() {
    const query = ref(new URLSearchParams(location.search).get('q') || '');
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
          ignoreLocation: true,
          useExtendedSearch: true,
          keys: ['title', 'description', 'tags.title'],
        });
      });

    return {
      query,
      docs,
      onSubmit() {
        history.pushState('', '', `/?${new URLSearchParams({ q: query.value })}`);
      },
    };
  },
});

app.config.compilerOptions.delimiters = ['[[', ']]'];

app.mount('#search');
