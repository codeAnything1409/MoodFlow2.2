import type { ContentItem, ContentCategory } from './types';
import { PlaceHolderImages } from './placeholder-images';

const contentData: Omit<ContentItem, 'imageUrl' | 'imageHint' | 'id'>[] = [
  { title: 'Deep Focus Music for Studying', description: 'Enhance your concentration with these ambient tracks.', category: 'Study'},
  { title: 'Library Sounds for Reading', description: 'The calming sounds of a library to help you read.', category: 'Study'},
  { title: 'Rise and Grind', description: 'Get pumped up with this playlist of motivational anthems.', category: 'Motivation' },
  { title: 'Unstoppable: A Motivational Speech', description: 'Listen to this speech to unlock your full potential.', category: 'Motivation' },
  { title: 'Chill Lo-fi Beats', description: 'Relax and unwind with these smooth lo-fi hip hop beats.', category: 'Music' },
  { title: 'Indie Pop Hits', description: 'Discover your new favorite indie pop tracks.', category: 'Music' },
  { title: '10-Minute Guided Meditation', description: 'A short meditation to clear your mind and reduce stress.', category: 'Meditation' },
  { title: 'Zen Garden: Sounds of Nature', description: 'Peaceful nature sounds for deep relaxation.', category: 'Meditation' },
  { title: 'Funny Animal Videos Compilation', description: 'A collection of hilarious animal clips to brighten your day.', category: 'Entertainment' },
  { title: 'Top Gaming Moments of the Week', description: 'Watch the most epic gaming highlights and fails.', category: 'Entertainment' },
];

export const allContent: ContentItem[] = contentData.map((item, index) => {
    const categoryKey = item.category.toLowerCase();
    const categoryImages = PlaceHolderImages.filter(p => p.id.startsWith(categoryKey));
    // Fallback to a generic image if no category-specific images are found
    const imagePool = categoryImages.length > 0 ? categoryImages : PlaceHolderImages;
    // Cycle through the available images for the category
    const image = imagePool[index % imagePool.length];
    
    return {
        id: `${categoryKey}-${index + 1}`,
        ...item,
        imageUrl: image.imageUrl,
        imageHint: image.imageHint,
    }
});

export const getContentForCategory = (category: ContentCategory | string | undefined): ContentItem[] => {
    if (!category) return [];
    
    const normalizedCategory = category.toLowerCase();
    
    const categoryContent = allContent.filter(item => item.category.toLowerCase() === normalizedCategory);

    // If a category has more than 2 items, we only return 3 for a cleaner UI
    if (categoryContent.length > 2) {
        return categoryContent.slice(0, 3);
    }
    return categoryContent;
}
