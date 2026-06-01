export default function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Sacred Shelf',
    url: 'https://thesacredshelf.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://thesacredshelf.com/library?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
