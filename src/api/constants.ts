const STOP_CODES = [
    ['FRADE', 'Metz Ville'],
    ['FRPAR', 'Paris toutes gares'],
    ['FRPST', 'Paris Est'],
    ['FRXTH', 'Thionville'],
    ['FREAM', 'Lorraine TGV'],
    ['FREAH', 'Champagne Ardennes TGV'],
    ['FREAJ', 'Meuse TGV'],
    ['LULUX', 'Luxembourg'],
].map((i) => i[0])

const URLS = {
    WISHES_URL: 'https://www.oui.sncf/wishes-api/wishes',
    FULL_WISH_BASE_URL: 'https://www.oui.sncf/proposition/rest/wishes/',
    TRAIN_URL: 'https://www.oui.sncf/proposition/rest/travels/outward/train',
    TRAIN_NEXT_URL:
        'https://www.oui.sncf/proposition/rest/travels/outward/train/next',
}

export { STOP_CODES, URLS }
