import { UploadedFile } from 'express-fileupload'
import fsPromises from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'

const imageStorageFolder = path.join(__dirname, '..', 'imageStorage')

export const getImagePath = (imageName: string): string => {
	return path.join(imageStorageFolder, imageName)
}

export const saveImage = async (image: UploadedFile) => {
	console.log(111)
	const extension = path.extname(image.name)
	const imageName = uuid() + extension
	const absolutePath = getImagePath(imageName)
	await image.mv(absolutePath)
	return imageName
}

export const updateImage = async (
	image: UploadedFile,
	prevImageName: string
): Promise<string> => {
	await deleteImage(prevImageName)
	const imageName = await saveImage(image)
	return imageName
}

export const deleteImage = async (imageName: string): Promise<void> => {
	try {
		if (!imageName) return
		const absolutePath = getImagePath(imageName)
		await fsPromises.unlink(absolutePath)
	} catch (error: any) {
		console.log(error.message)
	}
}
