export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('admin-token')
  
  if (!token.value) {
    return navigateTo('/admin')
  }
})