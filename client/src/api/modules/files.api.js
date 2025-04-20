import privateClient from '../clients/private.client'

const fileEndpoints = {
  upload: 'files/upload'
}

const filesApi = {
  upload: async ({ file }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await privateClient.post(
        fileEndpoints.upload,
        formData
      )
      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default filesApi