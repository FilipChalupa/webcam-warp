;(async () => {
	const $video = document.querySelector('.video')
	const $picker = document.querySelector('.picker')
	const $pickerCameraSelect = $picker.querySelector('select')

	await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
	const cameras = (await navigator.mediaDevices.enumerateDevices()).filter(
		(device) => device.kind === 'videoinput',
	)

	$pickerCameraSelect.innerHTML = ''
	$pickerCameraSelect.innerHTML += `<option>Choose</option>`
	cameras.forEach((camera, i) => {
		$pickerCameraSelect.innerHTML += `<option value="${camera.deviceId}">${
			camera.label || `Camera ${i + 1}`
		}</option>`
	})

	$pickerCameraSelect.addEventListener('change', async () => {
		const deviceId = $pickerCameraSelect.value
		const constraints = {
			video: {
				deviceId: {
					exact: deviceId,
				},
			},
			audio: false,
		}
		const stream = await navigator.mediaDevices.getUserMedia(constraints)
		$video.srcObject = stream
		$picker.remove()
	})
})()
