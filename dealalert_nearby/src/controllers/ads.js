//
// Ads & Affiliate controller: returns static or hard-coded list for MVP
//

// PUBLIC_INTERFACE
class AdsController {
  async list(req, res) {
    // You would fetch this from a DB or 3rd party or config in real app
    const ads = [
      {
        id: 'ad1',
        imageUrl: 'https://placehold.co/300x100?text=Big+Sale',
        clickUrl: 'https://affiliate.site.com/deal123',
        label: '25% Off Coffee Nearby!',
        type: 'affiliate',
      },
      {
        id: 'ad2',
        imageUrl: 'https://placehold.co/300x100?text=Ad2',
        clickUrl: 'https://affiliate.site.com/deal456',
        label: 'Lunch Special with $5 Off!',
        type: 'banner',
      },
    ];
    res.json({ ads });
  }
}

module.exports = new AdsController();
