require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'NativeAlert'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = { :type => 'MIT' }
  s.author         = 'ParkerReactNativeExpoLab'
  s.homepage       = 'https://github.com/archer102125220/ParkerReactNativeExpoLab'
  s.platforms      = {
    :ios => '15.1'
  }
  s.swift_version  = '5.9'
  s.source         = { :path => '.' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = 'NativeAlertModule.swift'
end
