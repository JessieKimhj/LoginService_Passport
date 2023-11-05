export { }

declare global {
    namespace Express {
        export interface User { id: number, name: string, email?: string, password?: string, role: string}
    }
}