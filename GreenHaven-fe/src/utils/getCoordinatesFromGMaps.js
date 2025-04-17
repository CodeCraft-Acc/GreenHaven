// utils/getCoordinatesFromGMaps.js
export const getCoordinatesFromGMaps = (gMapsIframe) => {
  try {
    // Membuat elemen DOM sementara untuk memparsing iframe src
    const parser = new DOMParser();
    const doc = parser.parseFromString(gMapsIframe, 'text/html');
    const iframe = doc.querySelector('iframe');

    if (!iframe) {
      throw new Error('Iframe tidak ditemukan dalam string gMaps');
    }

    const src = iframe.getAttribute('src');
    const url = new URL(src);
    const params = url.searchParams.get('pb');

    if (!params) {
      throw new Error('Parameter "pb" tidak ditemukan dalam URL gMaps');
    }

    // Menggunakan regex untuk mencari pola !2d[longitude] dan !3d[latitude]
    const lngMatch = params.match(/!2d(-?\d+\.\d+)/);
    const latMatch = params.match(/!3d(-?\d+\.\d+)/);

    if (latMatch && lngMatch) {
      return {
        lat: parseFloat(latMatch[1]),
        lng: parseFloat(lngMatch[1]),
      };
    } else {
      throw new Error('Koordinat tidak ditemukan dalam parameter "pb"');
    }
  } catch (error) {
    console.error('Error extracting coordinates:', error);
    // Mengembalikan koordinat default jika terjadi error
    return { lat: 0, lng: 0 };
  }
};
