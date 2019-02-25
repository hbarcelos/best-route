function PriorityQueue() {
    const collection = [];

    return {
        enqueue(element) {
            if (collection.length === 0) {
                collection.push(element);
            } else {
                let added = false;

                for (let i = 0; i < collection.length; i++) {
                    if (element.priority < collection[i].priority) {
                        collection.splice(i, 0, element);
                        added = true;
                        break;
                    }
                }

                if (!added) {
                    collection.push(element);
                }
            }

            return this;
        },
        dequeue() {
            return collection.shift();
        },
        isEmpty() {
            return collection.length === 0;
        }
    }
}

module.exports = PriorityQueue;