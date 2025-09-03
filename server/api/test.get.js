export default defineEventHandler(async (event) => {
  return {
    test: true,
    message: 'Test API route is working'
  }
})