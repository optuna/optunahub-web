const { createApp, ref, computed } = Vue;

const searchKeys = ['title', 'description', 'tags.title'];

// Fuse's extended search ANDs space-separated terms within a single field value,
// so a query like "Constrained Optimization Benchmark" never matches a package
// that carries those words in different fields (or in different tags). Build a
// logical query instead, requiring every term to match in at least one field.
const buildQuery = (query) => {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return '!^'; // matches everything
  }
  return {
    $and: terms.map((term) => ({ $or: searchKeys.map((key) => ({ [key]: term })) })),
  };
};

const app = createApp({
  setup() {
    const query = ref(new URLSearchParams(location.search).get('q') || '');
    const fuse = ref(null);
    const docs = computed(() => {
      page.value = 1
      if (fuse.value) {
        return fuse.value.search(buildQuery(query.value));
      }
      return [];
    });
    const page = ref(1);
    const perSize = ref(20);
    const totalPages = computed(() => Math.ceil(docs.value.length / perSize.value));
    const pageDocs = computed(() =>
      docs.value.slice((page.value - 1) * perSize.value, page.value * perSize.value),
    );

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
            keys: searchKeys,
            sortFn: (a, b) => a.idx - b.idx,
          },
        );
      });

    return {
      query,
      docs,
      page,
      totalPages,
      pageDocs,
      onSubmit() {
        history.pushState('', '', `/?${new URLSearchParams({ q: query.value })}`);
      },
    };
  },
});

app.config.compilerOptions.delimiters = ['[[', ']]'];

app.mount('#search');
