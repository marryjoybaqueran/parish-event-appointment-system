  async function updateUserImage(file) {
    // Get the file extension from the uploaded file
    // const fileExtension = file.name.split('.').pop()

    // Upload the file with the user ID and file extension
    const { data, error } = await supabase.storage
      .from('forms')
      .upload('forms_bucket/' + userData.value.id + '-forms.png', file, {
        cacheControl: '3600',
        upsert: true,
      })

    // Check if it has error
    if (error) {
      return { error }
    }
    // If no error set data to userData state with the image_url
    else if (data) {
      // Retrieve Image Public Url
      const { data: imageData } = supabase.storage.from('forms').getPublicUrl(data.path)

      // Update the user information with the new image_url
      return await updateUserInformation({ ...userData.value, image_url: imageData.publicUrl })
    }
  }