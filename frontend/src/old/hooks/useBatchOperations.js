// ============= 복수 작업 처리 훅 =============

import { useMutation } from '@tanstack/react-query';
import {apiClient} from "@/old/lib/apiClient.js";

/**
 * @typedef {Object} BatchOperation
 * @property {string} id
 * @property {function} operation
 * @property {function} [onSuccess]
 * @property {function} [onError]
 */

/**
 * @typedef {Object} BatchResult
 * @property {string} id
 * @property {boolean} success
 * @property {*} [data]
 * @property {*} [error]
 */

export const useBatchOperations = () => {
    return useMutation({
        mutationFn: async (operations) => {
            const requests = operations.map(op => op.operation);

            try {
                const results = await apiClient.batchRequests(requests);

                return operations.map((op, index) => {
                    const result = {
                        id: op.id,
                        success: true,
                        data: results[index]
                    };
                    op.onSuccess?.(results[index]);
                    return result;
                });

            } catch (error) {
                return operations.map(op => ({
                    id: op.id,
                    success: false,
                    error
                }));
            }
        },
    });
};

