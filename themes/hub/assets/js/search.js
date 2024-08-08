const { createApp, ref, computed } = Vue;

const app = createApp({
  setup() {
    const query = ref(new URLSearchParams(location.search).get('q') || '');
    const fuse = ref(null);
    const docs = computed(() => {
      if (fuse.value) {
        return fuse.value.search(query.value || '!^');
      }
      return [];
    });

    fetch('/index.json')
      .then((resp) => resp.json())
      .then((data) => {
        fuse.value = new Fuse(
          data
            .map((item) => ({ ...item, updated_at: dayjs(item.updated_at) }))
            .sort((a, b) => b.updated_at - a.updated_at),
          {
            threshold: 0.1,
            ignoreLocation: true,
            useExtendedSearch: true,
            keys: ['title', 'description', 'tags.title'],
            sortFn: (a, b) => a.idx - b.idx,
          },
        );
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
