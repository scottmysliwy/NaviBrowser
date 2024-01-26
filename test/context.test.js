

class ContextNavigator {
    constructor(contextWindow) {
        this.contextWindow = contextWindow;
        this.contextIndex = [0, 0];
    }

    updateMainWindow(url) {
        // Your implementation for updating the main window
    }

    contextNext() {
        if (this.canMoveRight()) {
            this.contextIndex[1]++;
            this.updateMainWindow(this.getCurrentUrl());
        }
    }

    contextPrev() {
        if (this.canMoveLeft()) {
            this.contextIndex[1]--;
            this.updateMainWindow(this.getCurrentUrl());
        }
    }

    contextUp() {
        if (this.canMoveUp()) {
            this.contextIndex[0]++;
            this.updateMainWindow(this.getCurrentUrl());
        }
    }

    contextDown() {
        if (this.canMoveDown()) {
            this.contextIndex[0]--;
            this.updateMainWindow(this.getCurrentUrl());
        }
    }

    getCurrentUrl() {
        return this.contextWindow[this.contextIndex[0]][this.contextIndex[1]].url;
    }

    canMoveRight() {
        return this.contextIndex[1] < this.contextWindow[this.contextIndex[0]].length - 1;
    }

    canMoveLeft() {
        return this.contextIndex[1] > 0;
    }

    canMoveUp() {
        return this.contextIndex[0] < this.contextWindow.length - 1;
    }

    canMoveDown() {
        return this.contextIndex[0] > 0;
    }
}






const contextWindow = [
    [{ url: 'url00' }, { url: 'url01' }],
    [{ url: 'url10' }, { url: 'url11' }],
];

describe('ContextNavigator', () => {
    let navigator;

    beforeEach(() => {
        navigator = new ContextNavigator(contextWindow);
    });

    describe('contextNext', () => {
        it('moves to the next item in the row', () => {
            navigator.contextNext();
            expect(navigator.contextIndex).toEqual([0, 1]);
            expect(navigator.getCurrentUrl()).toBe('url01');
        });

        it('handles out-of-bounds', () => {
            navigator.contextIndex = [0, 1];
            navigator.contextNext(); // Should not move
            expect(navigator.contextIndex).toEqual([0, 1]);
        });
    });

    describe('contextPrev', () => {
    it('moves to the previous item in the row', () => {
        navigator.contextIndex = [0, 1];
        navigator.contextPrev();
        expect(navigator.contextIndex).toEqual([0, 0]);
        expect(navigator.getCurrentUrl()).toBe('url00');
    });

    it('handles out-of-bounds', () => {
        navigator.contextIndex = [0, 0];
        navigator.contextPrev(); // Should not move
        expect(navigator.contextIndex).toEqual([0, 0]);
    });
});

describe('contextUp', () => {
    it('moves to the item above', () => {
        navigator.contextIndex = [0, 0];
        navigator.contextUp();
        expect(navigator.contextIndex).toEqual([1, 0]);
        expect(navigator.getCurrentUrl()).toBe('url10');
    });

    it('handles out-of-bounds', () => {
        navigator.contextIndex = [1, 0];
        navigator.contextUp(); // Should not move
        expect(navigator.contextIndex).toEqual([1, 0]);
    });
});

describe('contextDown', () => {
    it('moves to the item below', () => {
        navigator.contextIndex = [1, 0];
        navigator.contextDown();
        expect(navigator.contextIndex).toEqual([0, 0]);
        expect(navigator.getCurrentUrl()).toBe('url00');
    });

    it('handles out-of-bounds', () => {
        navigator.contextIndex = [0, 0];
        navigator.contextDown(); // Should not move
        expect(navigator.contextIndex).toEqual([0, 0]);
    });
});

});

