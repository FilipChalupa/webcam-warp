;(async () => {
	const currentUrl = new URL(document.location)
	if (currentUrl.searchParams.get('reset') !== null) {
		localStorage.removeItem('lastDeviceId')
		currentUrl.searchParams.delete('reset')
		location.href = currentUrl.toString()
	}

	const $video = document.querySelector('.video')
	const $picker = document.querySelector('.picker')
	const $pickerCameraSelect = $picker.querySelector('select')

	const selectCamera = async (deviceId) => {
		localStorage.setItem('lastDeviceId', deviceId)
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
	}

	await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
	const cameras = (await navigator.mediaDevices.enumerateDevices()).filter(
		(device) => device.kind === 'videoinput',
	)

	const lastDeviceId = localStorage.getItem('lastDeviceId')
	if (
		lastDeviceId &&
		cameras.some((camera) => camera.deviceId === lastDeviceId)
	) {
		selectCamera(lastDeviceId)
	} else {
		$pickerCameraSelect.innerHTML = ''
		$pickerCameraSelect.innerHTML += `<option>Choose</option>`
		cameras.forEach((camera, i) => {
			$pickerCameraSelect.innerHTML += `<option value="${camera.deviceId}">${
				camera.label || `Camera ${i + 1}`
			}</option>`
		})
	}

	$pickerCameraSelect.addEventListener('change', () => {
		selectCamera($pickerCameraSelect.value)
	})
})()
