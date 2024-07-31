const { createApp, ref, computed } = Vue;

const app = createApp({
  setup() {
    const query = ref(new URLSearchParams(location.search).get('q') || '');
    const fuse = ref(null);
    const docs = computed(() => {
      let data = [];
      if (fuse.value) {
        data = fuse.value._docs.map((item) => ({ item }));
        if (query.value) {
          data = fuse.value.search(query.value);
        }
      }
      data.map((item) => {
        item.item.updated_at = dayjs(item.item.updated_at)
      });
      data.sort((a, b) => (b.item.updated_at - a.item.updated_at));
      return data;
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
