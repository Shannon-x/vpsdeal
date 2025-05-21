// This file contains utility functions for formatting VPS data, such as price formatting.

export function formatPrice(price) {
    return `$${price.toFixed(2)}/yr`;
}

export function formatVpsDetails(vps) {
    return `${vps.name} - ${vps.ram} RAM, ${vps.storage} Storage, ${vps.bandwidth} BW`;
}