export default function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tarique Mahmood Hashmi',
    jobTitle: 'Religious Scholar and Translator',
    knowsLanguage: ['Urdu', 'Arabic', 'English'],
    url: 'https://thesacredshelf.com/about/tarique-mahmood-hashmi',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
