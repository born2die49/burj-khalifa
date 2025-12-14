import React from 'react'
import { CardDescription } from '../ui/card';
import ToolTip from '../shared/ToolTip';
import { BookMarkedIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

interface PostActionProps {
  upvotes: number | undefined;
  downvotes: number | undefined;
  handleUpvote: () => void;
  handleDownvote: () => void;
  handleBookmarkPost: () => void;
  isUpvoteLoading: boolean;
  isDownvoteLoading: boolean;
  isBookmarkLoading: boolean;
}

export default function PostActions({upvotes, downvotes, handleUpvote, handleDownvote, handleBookmarkPost, isUpvoteLoading, isBookmarkLoading, isDownvoteLoading}: PostActionProps) {
  return (
    <CardDescription className='mt-2'>
      <p className='flex items-center space-x-2'>
        <ToolTip content="Upvote this post" position='bottom'>
          <button onClick={handleUpvote} disabled={isUpvoteLoading}>
            <ThumbsUpIcon className='tab-icon text-electricIndigo hidden sm:block'/>
          </button>
        </ToolTip>
        <span className='text-xm-font-baby'>{upvotes}</span>

        <ToolTip content="Downvote this post" position='top'>
          <button onClick={handleDownvote} disabled={isDownvoteLoading}>
            <ThumbsDownIcon className='tab-icon text-electricIndigo hidden sm:block'/>
          </button>
        </ToolTip>
        <span className='text-xm-font-baby'>{downvotes}</span>

        <ToolTip content="Bookmark this post" position='top'>
          <button onClick={handleBookmarkPost} disabled={isBookmarkLoading}>
            <BookMarkedIcon className='tab-icon text-electricIndigo hidden sm:block'/>
          </button>
        </ToolTip>
      </p>
    </CardDescription>
  )
}
