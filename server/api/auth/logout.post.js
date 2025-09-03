export default defineEventHandler(async (event) => {
  // 清除 admin-token cookie
  setCookie(event, 'admin-token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0
  })
  
  return {
    success: true,
    message: 'Logged out successfully'
  }
})