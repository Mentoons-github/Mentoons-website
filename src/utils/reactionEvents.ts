// Simple event emitter for reaction updates
class ReactionEventEmitter extends EventTarget {
  emitReactionUpdate(postId: string, reactionCounts: Record<string, number>) {
    this.dispatchEvent(
      new CustomEvent('reactionUpdate', {
        detail: { postId, reactionCounts }
      })
    );
  }

  onReactionUpdate(callback: (event: CustomEvent) => void) {
    this.addEventListener('reactionUpdate', callback as EventListener);
    
    // Return cleanup function
    return () => {
      this.removeEventListener('reactionUpdate', callback as EventListener);
    };
  }
}

export const reactionEventEmitter = new ReactionEventEmitter(); 