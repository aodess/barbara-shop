import content from '../data/content.json';

export function whatsappLink(number, text = '') {
  const clean = number.replace(/\D/g, '');
  return `https://wa.me/${clean}${text ? '?text=' + encodeURIComponent(text) : ''}`;
}

export function buildJsonLd(lang) {
  const c = content;
  const siteUrl = (c.seo.siteUrl || '').replace(/\/$/, '');
  const addr = c.salon.address;
  const geo  = c.salon.geo;

  const DOW_MAP = { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' };
  const openingHours = Object.entries(c.hours)
    .filter(([, v]) => v && !v.closed)
    .map(([k, v]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${DOW_MAP[k]}`,
      opens: v.open,
      closes: v.close,
    }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: c.brand.name,
    url: `${siteUrl}/${lang}/`,
    image: c.seo.ogImage ? `${siteUrl}${c.seo.ogImage}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: addr[lang] || addr.ru,
      addressLocality: typeof c.salon.city === 'string' ? c.salon.city : (c.salon.city[lang] || c.salon.city.ru),
      addressCountry: c.salon.countryCode || 'IL',
      postalCode: c.salon.postalCode || undefined,
    },
    geo: geo?.lat ? { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng } : undefined,
    openingHoursSpecification: openingHours,
    areaServed: (c.salon.serviceAreas || []).map(a => ({ '@type': 'City', name: a })),
    aggregateRating: c.googleReviews?.count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: c.googleReviews.rating,
      reviewCount: c.googleReviews.count,
    } : undefined,
    hasOfferCatalog: c.services?.length ? {
      '@type': 'OfferCatalog',
      name: c.brand.name,
      itemListElement: c.services.map((s, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: {
          '@type': 'Service',
          name: s.name[lang] || s.name.ru,
          description: s.description?.[lang] || s.description?.ru || undefined,
        },
        price: s.price,
        priceCurrency: c.pricing.currency,
      })),
    } : undefined,
  };

  // Убрать undefined
  return JSON.stringify(schema, (k, v) => v === undefined ? undefined : v, 2);
}
